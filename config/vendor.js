var Vendor = {
    movie_db: {
        key: process.env.MOVIEDB_KEY,
        base_url: 'https://api.themoviedb.org/3/',
        static_url: '',
        formatUri: function (uri) {
            var result = Vendor.movie_db.base_url + uri;
            result += (result.indexOf('?') === -1) ? '?api_key=' : '&api_key=';
            result += Vendor.movie_db.key;
            return result;
        },
        uris: {
            movie_search: 'search/movie?search_type=ngram&query=',
            movie_info: 'movie/',
            popular: 'movie/popular'
        }
    },
    rotten_tomatoes: {
        key: process.env.RT_KEY,
        base_url: 'http://api.rottentomatoes.com/api/public/v1.0/',
        formatUri: function (uri) {
            var result = Vendor.rotten_tomatoes.base_url + uri;
            result += (result.indexOf('?') === -1) ? '?apikey=' : '&apikey=';
            result += Vendor.rotten_tomatoes.key;
            return result;
        }
    }
};

module.exports = Vendor;