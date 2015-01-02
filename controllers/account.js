var Promise = require('bluebird'),
salt = Promise.promisify(require('bcrypt').genSalt),
hash = Promise.promisify(require('bcrypt').hash),
compare = Promise.promisify(require('bcrypt').compare),
_ = require('lodash'),
Account = require('../models').account;


module.exports = {

};