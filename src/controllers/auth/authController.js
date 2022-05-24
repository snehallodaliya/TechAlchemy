/**
 * authController.js
 * @description : exports action methods for user create and login and logout.
 */

const userSchemaKey = require('../../utils/validation/userValidation');
const loginSchemaKey = require('../../utils/validation/loginValidation');
const logoutSchemaKey = require('../../utils/validation/logoutValidation');
const commonService = require('../../services/commonService');
const validation = require('../../utils/validateRequest');
const { User, Token } = require('../../models');

/**
 * @description : create document of user in mongodb collection.
 * @param {obj} req : request including body for creating document.
 * @param {obj} res : response of created document
 * @return {obj} : created Cart. {status, message, data}
 */
const register = async (req, res) => {
    try {
        let validateRequest = validation.validateParamsWithJoi(req.body, userSchemaKey.schemaKeys);
        if (!validateRequest.isValid) {
            return res.inValidParam({ message: `Invalid values in parameters, ${validateRequest.message}` });
        }

        const documentsCount = await User.countDocuments({ email: req.body.email });
        if (documentsCount === 0) {
            const createdUser = await User.create(req.body);
            return res.ok({ data: createdUser, message: "User registration successfully" });
        }
        return res.isDuplicate({ message: "This email already exists! please try with different mail or login your account with this email.." });

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
 * @description : Login to the user based on email and password.
 * @param {obj} req : request including body parameter with email and password
 * @param {obj} res : response contains data found from collection.
 * @return {obj} : found Login Details. {status, message, data}
 */
const login = async (req, res) => {
    try {
        let validateRequest = validation.validateParamsWithJoi(req.body, loginSchemaKey.schemaKeys);

        if (!validateRequest.isValid) {
            return res.inValidParam({ message: `${validateRequest.message}` });
        }
        const email = req.body.email;
        const password = req.body.password;

        if (email) {
            const user = await User.findOne({ email });
            if (!user || !(await user.isPasswordMatch(password))) {
                return res.recordNotFound();
            }
            if (user.isEmailVerified === false) {
                return res.badRequest({ message: 'Please confirm email.' });
            }
            if (user) {
                const tokens = await commonService.generateAuthTokens(user);
                return res.loginSuccess({ data: { ...user.toJSON(), token: tokens.accessTokenData.token } });
            }
            else {
                return res.loginFailed();
            }
        }
        return res.recordNotFound();
    } catch (error) {
        return res.failureResponse({ data: error.message });
    }
};

/**
 * @description : Logout to the user based on refreshToken.
 * @param {obj} req : request including body parameter with refreshToken.
 * @param {obj} res : response contains data found from collection.
 * @return {obj} : found Login Details. {status, message, data}
 */
const logout = async (req, res) => {
    try {
        let validateRequest = validation.validateParamsWithJoi(req.body, logoutSchemaKey.schemaKeys);

        if (!validateRequest.isValid) {
            return res.inValidParam({ message: `${validateRequest.message}` });
        }

        const refreshToken = await Token.findOne({ token: req.body.refreshToken, type: 'refresh', blacklisted: false });
        if (!refreshToken) {
            return res.recordNotFound();
        }
        await refreshTokenDoc.remove();
        return res.ok({ message: "Logout Successfully!" });
    } catch (error) {
        return res.failureResponse({ data: error.message });
    }
};

module.exports = {
    register,
    login,
    logout,
};