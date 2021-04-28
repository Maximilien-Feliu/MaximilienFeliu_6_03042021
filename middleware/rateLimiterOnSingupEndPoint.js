const mongoose = require('mongoose');
const { RateLimiterMongo } = require('rate-limiter-flexible');                      // request limiter for mongoDB
const User = require('../models/User');                                             // import the user model

const mongoConn = mongoose.connection;                                              // URI of the db connection

const maxCreatedAccount = 10;

/*****  Set the mongo rateLimiter object  *****/
const rateLimiter = new RateLimiterMongo({
    storeClient: mongoConn,
    keyPrefix: 'accounts_created',                                                  // key for the database
    points: maxCreatedAccount,                                                      // maximum points to reach
    duration: 60 * 60 * 24,                                                         // Store number for a day
    blockDuration: 60 * 60 * 24,                                                    // Block for a day 
});

module.exports = (req, res, next) => {
    rateLimiter.consume(req.ip)                                                     // one point added for every requests, user ip added to the limiter key
    .then(() => {
        next();
    })
    .catch(() => {
        res.status(429).json('Too Many accounts created');
    });
}