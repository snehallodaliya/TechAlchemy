const Joi = require('joi');

exports.schemaKeys = Joi.object({
    refreshToken: Joi.string().required(),
}).unknown(true);
