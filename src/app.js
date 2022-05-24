/**
 * app.js
 * Use `app.js` to run your app.
 * To start the server, run: `node app.js`.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
require('./config/db');
const passport = require('passport');

let logger = require('morgan');

const { jwtStrategy } = require('./config/passport');
const app = express();
const corsOptions = { origin: process.env.ALLOW_ORIGIN, };
app.use(cors(corsOptions));

app.use(require('./utils/responseHandler'));

//all routes 
const routes = require('./routes');

//jwt strategy
// app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use(routes);
app.use('/', (req, res,next) => {
  next();
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT, () => {
    console.log(`your application is running on ${process.env.PORT}`);
  });
} else {
  module.exports = app;
}
