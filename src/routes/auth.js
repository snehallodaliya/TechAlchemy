const express = require('express');
const authController = require('../controllers/auth/authController');


const router = express.Router();

router.route('/register').post(authController.register);

router.route('/login').post(authController.login);
router.route('/logout').post(authController.logout);
module.exports = router;

