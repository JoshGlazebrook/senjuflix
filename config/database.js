var _ = require('lodash'),
info,
details,
defaults;

defaults = {
    protocol: 'postgres',
    dialect: 'postgres'
};

// Use database credentials set via environmental variable.
if (process.env.DATABASE_URL) {
    details = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    info = {
        host: details[3],
        port: details[4],
        user: details[1],
        password: details[2],
        database: details[5]
    };

    console.log(info);
} else {

    // Use local database credentials manually set here.
    info = {
        host: 'localhost',
        port: 5432,
        user: 'mbp',
        password: 'retina',
        database: 'sf',
        debug: true
    };
}

info = _.defaults(info, defaults);

module.exports = info;