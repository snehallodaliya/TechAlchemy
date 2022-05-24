const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().default(5000),
    DB_CONNECTION: Joi.string().required().description('Mongo DB Connection'),
    DB_HOST: Joi.string().required().description('Mongo HDB Host'),
    DB_PORT: Joi.string().required().description('Mongo DB Port'),
    DB_DATABASE: Joi.string().required().description('Mongo DB Database'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    NEWS_API_KEY: Joi.string().description('News API keys'),
    WEATHER_API_KEY: Joi.string().description('Weather API keys')
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const dbConnection = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

module.exports = {
  port: envVars.PORT,
  mongoose: {
    url: dbConnection,
    options: {
      autoCreate: true,
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationDays: envVars.JWT_ACCESS_EXPIRATION_DAYS,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
  },
};
