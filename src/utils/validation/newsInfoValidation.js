const Joi = require('joi');

exports.schemaKeys = Joi.object({
    search: Joi.string().label('search')
}).unknown(true);
