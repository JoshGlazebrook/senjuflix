var config = require('../config').database,
path = require('path'),
fs = require('fs'),
Sequelize = require('sequelize'),
pg = require('pg'),
_ = require('lodash'),
db = {},
sequelize;

// Create Sequelize Instance
sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    port: config.port,
    protocol: config.protocol,
    dialect: config.protocol,
    logging: (config.debug) ? console.log : false
});

// Read Models in from /models/
fs
.readdirSync(__dirname)
.filter(function (file) {
    return ((file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) == '.js'))
})
.forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
});

// Associate models with each other if required.
Object.keys(db).forEach(function (model) {
    if (db[model].options.hasOwnProperty('associate'))
        db[model].options.associate(db);
});

module.exports = _.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);
