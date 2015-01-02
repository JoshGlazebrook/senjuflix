var Account = require('../models').account,
Queue = require('../models').queue,
Favorite = require('../models').favorite,
Movie = require('../models').movie,
scookie = require('../middleware/scookie'),
loginAuth = require('../middleware/auth').mustBeLoggedIn,
_ = require('lodash'),
Promise = require('bluebird');

module.exports = function (server, scookie) {
    var mustBeLoggedIn = loginAuth,
    resolveAccount = Account.resolveAccount;

    server.get('/login', function (req, res) {
        if (scookie.isLoggedIn(req)) {
            if (req.account) return res.redirect('/');

            scookie.logout(res);
        }

        return res.render('login', { title: 'Senjuflix - Login', error: req.flash('error')[0] });
    });

    server.post('/login', function (req, res) {
        Account.validateLogin(req.body.email, req.body.password)
        .then(function (account) {
            scookie.login({ id: account.id }, res);
            res.redirect('/');
        })
        .catch(function (err) {
            req.flash('error', err.message);
            res.redirect('/login');
        });
    });

    server.get('/logout', function (req, res) {
        scookie.logout(res);
        res.redirect('/login');
    });

    server.get('/register', function (req, res) {
        res.render('register', { title: 'Senjuflix - Register', error: req.flash('error')[0] });
    });

    server.post('/register', function (req, res) {
        Account.createAccount(req.body)
        .then(function (account) {
            scookie.login({ id: account.id }, res);
            res.redirect('/');
        })
        .catch(Error, function (ex) {
            req.flash('error', ex.message);
            res.redirect('/register');
        })
        .catch(function (ex) {
            req.flash('error', 'Error: Please make sure all your information is valid and try again. ');
            res.redirect('/register');
        });
    });


    server.get('/account', mustBeLoggedIn, resolveAccount, function (req, res) {
        res.render('account', {
            title: 'Senjuflix - Account',
            account: req.account
        })
    });

    server.get('/account/queue', mustBeLoggedIn, resolveAccount, function (req, res) {
        req.account.getQueues()
        .then(function (queues) {
            var lookups = [];
            queues.forEach(function (queues) {
                lookups.push(Movie.find({ where: { movie_id: queues.movie_id }})
                .then(function (result) {
                    queues.movie = result || {};
                    return queues;
                })
                .catch(function (ex) {
                    queues.movie = {};
                }));
            });

            return Promise.all(lookups)
            .then(function () {
                res.render('queue', {
                    title: 'Senjuflix - Your Queue',
                    queues: queues
                })
            });


        })
        .catch(function (ex) {
            res.render('queue', {
                title: 'Senjuflix - Your Queue',
                queues: []
            });
        });
    });

    server.post('/account/queue/', mustBeLoggedIn, resolveAccount, function (req, res) {
        // Does this queue item exist?
        Queue.find({ where: { account_id: req.account.id, movie_id: req.body.movie_id }})
        .then(function (item) {
            // Item exists, so remove it.
            if (item) {
                return item.destroy();
            } else {
                // Create item
                return Queue.create({
                    account_id: req.account.id,
                    movie_id: parseInt(req.body.movie_id, 10)
                });
            }
        })
        .then(function () {
            return res.json({ success: true });
        })
        .catch(function (ex) {
            return res.json(500, { success: false})
        });
    });

    server.get('/account/favorites', mustBeLoggedIn, resolveAccount, function (req, res) {
        req.account.getFavorites()
        .then(function (favorites) {
            var lookups = [];
            favorites.forEach(function (favorite) {
                lookups.push(Movie.find({ where: { movie_id: favorite.movie_id }})
                .then(function (result) {
                    favorite.movie = result;
                    return favorite;
                })
                .catch(function (ex) {

                }));
            });

            return Promise.all(lookups)
            .then(function () {
                res.render('favorites', {
                    title: 'Senjuflix - Favorites',
                    favorites: favorites
                })
            });


        })
        .catch(function (ex) {
            res.render('favorites', {
                title: 'Senjuflix - Favorites',
                favorites: []
            });
        });
    });

    server.post('/account/favorite', mustBeLoggedIn, resolveAccount, function (req, res) {
        // Does this favorite exist?
        Favorite.find({ where: { account_id: req.account.id, movie_id: req.body.movie_id }})
        .then(function (item) {
            // Item exists, so remove it.
            if (item) {
                return item.destroy();
            } else {
                // Create item
                return Favorite.create({
                    account_id: req.account.id,
                    movie_id: parseInt(req.body.movie_id, 10)
                });
            }
        })
        .then(function () {
            return res.json({ success: true });
        })
        .catch(function (ex) {
            return res.json(500, { success: false})
        });
    });

};