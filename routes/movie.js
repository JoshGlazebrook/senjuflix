var Movies = require('../controllers').movie,
Account = require('../models').account,
_ = require('lodash'),
loginAuth = require('../middleware/auth').mustBeLoggedIn,
Promise = require('bluebird');

module.exports = function (server, scookie) {
    var mustBeLoggedIn = loginAuth,
    resolveAccount = Account.resolveAccount;

    server.get('/movie/:id', mustBeLoggedIn, resolveAccount, function (req, res) {
        Movies.getMovieInfo(req.params.id)
        .then(function (movie) {
            movie.similar_movies = _.first(movie.similar_movies, 6);
            movie.reviews = _.first(movie.reviews, 8);

            return Promise.all([ req.account.retrieveFavoriteStatus(movie.movie_id), req.account.retrieveQueueStatus(movie.movie_id)])
            .spread(function (isFavorite, inQueue) {
                return res.render('movie', {
                    title: 'Senjuflix - ' + movie.title,
                    isFavorite: isFavorite,
                    inQueue: inQueue,
                    movie: movie
                });
            });

        })
        .catch(function (ex) {
            res.render('movie', {
                title: 'Senjuflix - Error',
                movie: null
            })
        });
    });
};