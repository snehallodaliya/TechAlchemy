/**
 * db.js
 * @description :: exports database connection using mongoose
 */

const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.mongoose.url, config.mongoose.options);
let db = mongoose.connection;

db.once('open', () => {
  console.log('Connection Successful');
});

db.on('error', () => {
  console.log('Error in mongodb connection');
});

module.exports = mongoose;