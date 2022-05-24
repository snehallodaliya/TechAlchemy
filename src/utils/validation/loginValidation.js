const Joi = require('joi');

exports.schemaKeys = Joi.object({
    email: Joi.string().required().label('Email'),
    password: Joi.string().required().label('Password'),
}).unknown(true);



