const express = require('express');
const authenticate = require('../middlewares/authenticate');
const newsWetaherController = require('../controllers/newsWeather/newsWetaherController');


const router = express.Router();

router.route('/news').post(authenticate(), newsWetaherController.newsData);
router.route('/weather').post(newsWetaherController.weatherData);

module.exports = router;

