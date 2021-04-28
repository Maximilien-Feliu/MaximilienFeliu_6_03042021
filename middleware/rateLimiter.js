/*****  prevent requests spaming  *****/

const mongoose = require('mongoose');
const { RateLimiterMongo } = require('rate-limiter-flexible');                  // request limiter for mongoDB

const mongoConn = mongoose.connection;                                          // URI of the db connection

/*****  Set the mongo rateLimiter object  *****/
const rateLimiter = new RateLimiterMongo({
    storeClient: mongoConn,
    keyPrefix: 'too_many_requests',                                             // key for the database
    points: 10,                                                                 // maximum points to reach
    duration: 1,                                                                // ten points maximum per seconds
});

const rateLimiterMiddleware = (req, res, next) => {
    rateLimiter.consume(req.ip)                                                 // one point added for every requests, user ip added to the limiter key
    .then(() => {
        next();
    })
    .catch(_ => {
        res.status(429).json('Too Many Requests !');
    })
}

module.exports = rateLimiterMiddleware;