var http = require('http'),
path = require('path'),
express = require('express'),
flash = require('connect-flash'),
scookie = require('./middleware/scookie'),
config = require('./config').server,
routes = require('./routes'),
db = require('./models'),

server;

// Setup http server
server = new express();

server.set('port', config.port);
server.set('env', config.env);

// Enable detailed logging in development env.
server.configure('development', function () {
    server.use(express.logger('dev'));
    server.use(express.errorHandler());
});


// Load middleware
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');
server.use(express.cookieParser());
server.use(express.session({
    secret: 'senjuflix'
}));
server.use(flash());
server.use(express.json());
server.use(express.urlencoded());
server.use(server.router);
server.use(express.static(path.join(__dirname, 'public')));

// Load routes
routes.account(server, scookie);
routes.movie(server, scookie);
routes.search(server, scookie);

// Cookies
scookie.init({
    name: 'session',
    secret: 'senjuflix-netflix',
    age: 24 * 60 * 60 * 1000,
    unauthorisedUrl: '/login'
});

// Sync database
db.sequelize.sync({force: false})
.then(function () {
    server.listen(server.get('port'), function (err) {
        console.log("Web server now listening at: http://localhost:" + server.get('port'));
    });
})
.catch(function (err) {
    console.log(err);
    console.log("An error occured while setting up the database connection and schema. Please make sure your credentials in /config/database.js are correct.");
});