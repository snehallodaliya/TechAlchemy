const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');
const { Token } = require('../models');

/** Generate token */
const generateToken = (data, expires, secret = config.jwt.secret) => {
    const payload = {
        iat: moment().unix(),
        exp: expires.unix(),
        data,
    };
    return jwt.sign(payload, secret);
};

/** Save a token */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
    const tokenDoc = await Token.create({ token, user: userId, expires: expires.toDate(), type, blacklisted, });
    return tokenDoc;
};

/** Verify token and return token doc (or throw an error if it is not valid) */
const verifyToken = async (token, type) => {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await Token.findOne({ token, type, user: payload.data.userId, blacklisted: false });
    if (!tokenDoc) {
        throw new Error('Token not found');
    }
    return tokenDoc;
};

/** Generate auth tokens */
const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationDays, 'days');
    const accessToken = generateToken({ userId: user.id }, accessTokenExpires);

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken({ userId: user.id }, refreshTokenExpires);
    await saveToken(refreshToken, user._id, refreshTokenExpires, 'refresh');

    return {
        accessTokenData: { token: accessToken, expires: accessTokenExpires.toDate(), },
        refreshTokenData: { token: refreshToken, expires: refreshTokenExpires.toDate(), },
    };
};


module.exports = {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
};
