/******************
            router defining users routes for the application 
                                                *************************/

const express = require('express');
const router = express.Router();                        // create a router

const userCtrl = require('../controllers/user');        // import the user functions

/*****  define the specific router parameters   *****/
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;                                // export the router