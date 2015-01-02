var Search = require('../controllers').search,
Account = require('../models').account,
Movies = require('../controllers').movie,
loginAuth = require('../middleware/auth').mustBeLoggedIn;

module.exports = function (server, scookie) {
    var mustBeLoggedIn = loginAuth,
    resolveAccount = Account.resolveAccount;


    server.get('/', mustBeLoggedIn, resolveAccount, function (req, res) {
        Movies.getPopularMovies()
        .then(function (movies) {
            res.render('index', { title: 'Senjuflix - Home', movies: movies });
        })
        .catch(function (ex) {
            res.render('index', { title: 'Senjuflix - Home', movies: [] });
        });
    });

    server.post('/search', mustBeLoggedIn, resolveAccount, function (req, res) {
        Search.searchMovies(req.body.searchterms)
        .then(function (results) {
            res.render('search', {
                title: 'Senjuflix - Search',
                searchterms: req.body.searchterms,
                movies: results
            });
        })
        .catch(function (ex) {
            res.render('search', {
                title: 'Senjuflix - Search',
                searchterms: req.body.searchterms,
                movies: []
            });
        });
    });
};