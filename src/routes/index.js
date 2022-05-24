const express = require('express');

const apisRoute = require('./apis');
const authRoute = require('./auth');

const routes = express.Router();

routes.use('/api', apisRoute);
routes.use('/auth', authRoute);

module.exports = routes;
