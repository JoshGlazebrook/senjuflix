var Promise = require('bluebird'),
salt = Promise.promisify(require('bcrypt').genSalt),
hash = Promise.promisify(require('bcrypt').hash),
compare = Promise.promisify(require('bcrypt').compare),
_ = require('lodash'),
Movie = require('./movie'),
scookie = require('../middleware/scookie');
Queue = require('./queue');


module.exports = Account = function (sequelize, DataTypes) {
    var Account = sequelize.define('account', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        },

        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        },

        street: {
            type: DataTypes.STRING,
            allowNull: false
        },

        city: {
            type: DataTypes.STRING,
            allowNull: false
        },

        state: {
            type: DataTypes.STRING,
            allowNull: false
        },

        zipcode: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                min: 0,
                max: 99999
            }
        }
    }, {
        timestamps: false,

        associate: function (models) {
            Account.hasMany(models.queue, { foreignKey: 'account_id'});
            Account.hasMany(models.favorite, { foreignKey: 'account_id' });
        },

        instanceMethods: {
            retrieveFavoriteStatus: function (movie_id) {
                return this.getFavorites()
                .then(function (favs) {
                    return !_.isUndefined(_.chain(favs).find(function (item) {
                        return item.movie_id === movie_id;
                    }).valueOf());
                })
                .catch(function (ex) {
                    return false;
                });
            },

            retrieveQueueStatus: function (movie_id) {
                return this.getQueues()
                .then(function (queues) {
                    return !_.isUndefined(_.chain(queues).find(function (item) {
                        return item.movie_id === movie_id;
                    }).valueOf());
                })
                .catch(function (ex) {
                    return false;
                });
            }
        },

        classMethods: {
            /**
             * Creates a new account.
             * @param info
             * @returns {*}
             */
            createAccount: function (info) {
                // Check for duplicate email.
                return Account.find({ where: { email: info.email } })
                .then(function (user) {
                    if (user) throw new Error("Email is already associated with an account.");
                })
                .then(function () {
                    // Check password length
                    if (info.password.length < 6) throw new Error("Please enter a valid password that is greater than 6 characters.");

                    return salt(10)
                    .then(function (s) {
                        return hash(info.password, s);
                    });
                })
                .then(function (hash) {
                    info.password = hash;
                })
                .then(function () {
                    // Attempt to save Account
                    return Account.create(info);
                })
                .then(function (user) {
                    return user;
                });
            },

            accountExists: function (email) {
                return Account.find({ where: { email: email }})
                .then(function (account) {
                    return (account);
                })
                .catch(function (ex) {
                    return false;
                })
            },

            validateLogin: function (email, password) {
                return Account.find({ where: { email: email }})
                .then(function (account) {
                    if (!account) throw new Error("No account was found with the given email.");
                    // Compare password to hash
                    return compare(password, account.password)
                    .then(function (result) {
                        if (!result) throw new Error("The password you entered was invalid.");
                        return account;
                    })
                });
            },

            validatePassword: function (password, hash) {
                return compare(password, hash);
            },

            resolveAccount: function (req, res, next) {
                Account.find({ where: { id: req.cookieDetail.id }})
                .then(function (account) {
                    if (!account) return res.redirect('/login');
                    req.account = account;
                    return next();
                })
                .catch(function (err) {
                    scookie.logout(res);
                    return res.redirect('/login');
                });
            }
        }
    });

    return Account;
};