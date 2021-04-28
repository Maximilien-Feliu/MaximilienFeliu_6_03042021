/******************
            router defining users routes for the application 
                                                *************************/

const express = require('express');
const router = express.Router();                                                // create a router

const userCtrl = require('../controllers/user');                                // import the user functions
const limiterLogin = require('../middleware/rateLimiterOnLoginEndpoint');       // import the middleware to prevent brute force attacks on login
const limiterSignup = require('../middleware/rateLimiterOnSingupEndPoint');     // limit of creating accounts by id
const passwordValidator = require('../middleware/passwordValidator');           // set a password model
const regExp = require('../middleware/regExp');                                 // import regExp

/*****  define the specific router parameters   *****/
router.post('/signup', limiterSignup, regExp.user, passwordValidator, userCtrl.signup);
router.post('/login', limiterLogin, regExp.user, userCtrl.login);

module.exports = router;                                // export the router