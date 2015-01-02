var scookie = require('./scookie');


exports.mustBeLoggedIn = function (req, res, next) {
    if (scookie.isLoggedIn(req)) {
        req.cookieDetail = scookie.getCookie(req);
        return next();
    }
    scookie.logout(res);
    return res.redirect('/login');
};