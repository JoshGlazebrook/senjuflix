var Promise = require('bluebird'),
request = Promise.promisify(require('request')),
_ = require('lodash'),
movieDb = require('../config').vendor.movie_db,
rotten = require('../config').vendor.rotten_tomatoes,
models = require('../models'),
Movie = require('../models').movie,
Genre = require('../models').genre;


exports.getMovieInfo = function (movie_id) {

    // Check database first
    return Movie.find({
        where: {
            movie_id: movie_id
        }
    })
    .then(function (result) {
        // Found in db?
        if (!result) throw new Error('Not Found');

        return Promise.all([
            result.getGenres(),
            result.getActors(),
            result.getDirectors(),
            result.getReviews(),
            result.getSimilar()])
        .spread(function (genres, actors, directors, reviews, similar) {
            result = result.dataValues;
            result.genres = _.pluck(genres, 'type');
            result.cast = actors;
            result.directors = _.pluck(directors, 'name');
            result.reviews = reviews;
            result.similar_movies = similar;

            return result;
        });

    })
    .catch(function (ex) {
        // Get fresh info from api.
        return request(movieDb.formatUri(movieDb.uris.movie_info + encodeURIComponent(movie_id)) + '&append_to_response=credits,similar_movies')
        .spread(function (res, body) {
            if (res.statusCode !== 200)
                if (res.statusCode === 404) throw api.createError(404, "NotFound");
                else throw api.createError(500, "ApiError");
            return JSON.parse(body);
        })
        .then(function (result) {

            movie_id = result.id;

            // Extract Relevant Movie Info
            return {
                movie_id: result.id,
                imdb_id: result.imdb_id,
                title: result.title,
                poster_url: result.poster_path,
                synopsis: result.overview,
                release_date: new Date(Date.parse(result.release_date || 0)),
                runtime: result.runtime,
                year: new Date(Date.parse(result.release_date)).getFullYear(),
                studio: _.chain(result.production_companies).pluck('name').first().valueOf(),

                genres: _.pluck(result.genres, 'name'),

                cast: _.chain(result.credits.cast).map(function (item) {
                    return {
                        name: item.name,
                        character: item.character,
                        poster_url: item.profile_path
                    };
                }).first(10).valueOf(),

                directors: _.chain(result.credits.crew).where({ job: 'Director' }).pluck('name').valueOf(),
                producers: _.chain(result.credits.crew).where({ job: 'Producer'}).pluck('name').valueOf(),
                similar_movies: _.chain(result.similar_movies.results).map(function (item) {
                    return {
                        similar_movie_id: item.id,
                        title: item.title,
                        poster_url: item.poster_path
                    };
                }).valueOf(),
                reviews: []
            };
        })
            // Get info from Rotten Tomatoes
        .then(function (movie_info) {
            return request(rotten.formatUri('movie_alias.json?type=imdb&id=' + movie_info.imdb_id.replace('tt', '')))
            .spread(function (res, body) {
                if (res.statusCode !== 200) throw api.createError(500, "ApiError");
                return JSON.parse(body);
            })
                // Extract Rotten Tomatoes Info
            .then(function (result) {
                movie_info = _.extend(movie_info, {
                    mpaa_rating: result.mpaa_rating,
                    critic_score: result.ratings.critics_score,
                    audience_score: result.ratings.audience_score
                });

                return result.id;
            })
            .then(function (movie_rotten_id) {
                return request(rotten.formatUri('movies/' + movie_rotten_id + '/reviews.json'))
                .spread(function (res, body) {
                    if (res.statusCode !== 200) throw api.createError(500, "ApiError");
                    return JSON.parse(body);
                })
                .then(function (result) {
                    movie_info.reviews = _.chain(result.reviews).map(function (item) {
                        return {
                            critic_name: item.critic,
                            date: new Date(Date.parse(item.date)),
                            fresh: item.freshness === 'fresh',
                            quote: item.quote
                        }
                    }).valueOf();

                    return movie_info;
                });
            })
            .catch(function (err) {
                console.log(err);
                return movie_info;
            });
        })
        .then(function (movie_info) {

            // Save Movie to DB
            Movie.create(movie_info)
                // Save Genres
            .then(function (movie) {
                return Promise.all(_.map(movie_info.genres, function (genre) {
                    return Genre.create({
                        movie_id: movie_info.movie_id,
                        type: genre
                    });
                }))
            })
                // Save Cast
            .then(function () {
                return Promise.all(_.map(movie_info.cast, function (actor) {
                    return models.actor.create(_.extend(actor, { movie_id: movie_info.movie_id }));
                }));
            })
                // Save Directors
            .then(function () {
                return Promise.all(_.map(movie_info.directors, function (director) {
                    return models.director.create({ movie_id: movie_info.movie_id, name: director });
                }))
            })
                // Save Similar Movies
            .then(function () {
                return Promise.all(_.map(movie_info.similar_movies, function (movie) {
                    return models.similar_movie.create(_.extend(movie, { movie_id: movie_info.movie_id }));
                }));
            })
                // Save Reviews
            .then(function () {
                return Promise.all(_.map(movie_info.reviews, function (review) {
                    return models.review.create(_.extend(review, { movie_id: movie_info.movie_id }));
                }));
            })
            .catch(function (err) {
                // TODO: silent error?
                console.log("Error Saving Movie");
                console.log(err);
            });

            return _.omit(movie_info, 'imdb_id');
        });
    });
};

exports.getPopularMovies = function () {
    return request(movieDb.formatUri(movieDb.uris.popular))
    .spread(function (res, body) {
        if (res.statusCode !== 200) throw api.createError(500, "ApiError");
        var result = JSON.parse(body);
        return result.results;
    })
};
