const axios = require('axios');
const moment = require('moment');
const newsSchemaKey = require('../../utils/validation/newsInfoValidation');
const weatherSchemaKey = require('../../utils/validation/weatherInfoValidation');
const validation = require('../../utils/validateRequest');

/**
 * @description : Fetch data from rest news api.
 * @param {obj} req : request including token in header and body with search keyword(if requires).
 * @param {obj} res : response of retrieves all document
 * @return {obj} : fetched data. {status, message, data}
 */
const newsData = async (req, res) => {
    try {
        let validateRequest = validation.validateParamsWithJoi(req.body, newsSchemaKey.schemaKeys);
        if (!validateRequest.isValid) {
            return res.inValidParam({ message: `Invalid values in parameters, ${validateRequest.message}` });
        }

        let keyword = req.body.search;
        let url = `https://newsapi.org/v2/top-headlines?`;

        if (keyword) { url += `q=${keyword}&` }
        else { url += `language=en&` }

        url += `apiKey=${process.env.NEWS_API_KEY}`
        let response = await axios.get(url);
        let finalData = [];
        if (response && response.data && response.data.articles && response.data.articles.length) {
            response.data.articles.map((e) => {
                finalData.push({ headline: e.title, link: e.url });
            })
        }
        return res.ok({ data: { data: finalData, count: finalData.length }, message: "News data fetch successfully" });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.validationError({ message: `Invalid Data, Validation Failed at ${error.message}` });
        }
        if (error.code && error.code == 11000) {
            return res.isDuplicate();
        }
        return res.failureResponse({ data: error.message });
    }
};

/**
 * @description : Fetch data from rest weather api data.
 * @param {obj} req : request including body with search keyword(if requires).
 * @param {obj} res : response of retrieves all document
 * @return {obj} : fetched data. {status, message, data}
 */
const weatherData = async (req, res) => {
    try {
        let validateRequest = validation.validateParamsWithJoi(req.body, weatherSchemaKey.schemaKeys);
        if (!validateRequest.isValid) {
            return res.inValidParam({ message: `Invalid values in parameters, ${validateRequest.message}` });
        }

        let keyword = req.body.search
        let url = `http://api.openweathermap.org/data/2.5/forecast?`

        if (keyword) { url += `q=${keyword}&` }
        else { url += `q=London&` }
        url += `appid=${process.env.WEATHER_API_KEY}`
        let response = await axios.get(url);
        let finalData = [];
        if (response && response.data && response.data.list && response.data.list.length) {
            response.data.list.map((e) => {
                finalData.push({ Date: moment(new Date(e.dt_txt)).toString(), main: e.weather[0].main, temp: e.main.temp });
            })
        }
        return res.ok({ data: { data: finalData, count: finalData.length }, message: "Weather data fetch successfully" });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.validationError({ message: `Invalid Data, Validation Failed at ${error.message}` });
        }
        if (error.code && error.code == 11000) {
            return res.isDuplicate();
        }
        return res.failureResponse({ data: error.message });
    }
};

module.exports = {
    newsData,
    weatherData,
};
