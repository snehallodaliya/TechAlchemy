const Joi = require('joi');

exports.schemaKeys = Joi.object({
    email: Joi.string().label('Email'),
    password: Joi.string().required().label('Password'),
    name: Joi.string().required().label('Name'),
}).unknown(true);
