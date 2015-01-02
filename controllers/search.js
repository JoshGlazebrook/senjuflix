var bluebird = require('bluebird'),
request = bluebird.promisify(require('request')),
movieDb = require('../config').vendor.movie_db;

exports.searchMovies = function (searchstr) {
    return request(movieDb.formatUri(movieDb.uris.movie_search + encodeURIComponent(searchstr)))
    .spread(function (res, body) {
        if (res.statusCode !== 200) throw api.createError(500, "ApiError");
        var result = JSON.parse(body);
        return result.results;
    });
};
