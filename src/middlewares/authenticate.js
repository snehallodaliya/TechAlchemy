const passport = require('passport');

const verifyCallback = (req, res, resolve, reject) => async (err, user, info) => {
    if (err || info || !user) {
        return reject('Unauthorized User');
    }
    if (user.isActive !== true) {
        return reject('User is deactivated');
    }
    const localUser = user.toJSON();
    req.user = localUser;
    resolve();
};

const authenticate = (...requiredRights) => async (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, verifyCallback(req, res, resolve, reject, requiredRights))(
            req,
            res,
            next
        );
    })
        .then(() => next())
        .catch((err) => res.unAuthorizedRequest());
};

module.exports = authenticate;
