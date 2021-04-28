/*****  prevent accounts login attacks by limiting the numbers of login tries,
 *****  block any user from the email account if it does exist or by the ip to prevent email searching spaming, 
 *****  do it if the number of request is higher than the rateLimiter consumed points  *****/

const mongoose = require('mongoose');
const { RateLimiterMongo } = require('rate-limiter-flexible');                      // request limiter for mongoDB
const User = require('../models/User');                                             // import the user model
const bcrypt = require('bcrypt');                                                   // package to create hashes for passwords

const mongoConn = mongoose.connection;                                              // URI of the db connection

const maxConsecutiveFailsByUsername = 5;

/*****  Set the mongo rateLimiter object  *****/
const rateLimiter = new RateLimiterMongo({
    storeClient: mongoConn,
    keyPrefix: 'login_fail_consecutive_username',                                   // key for the database
    points: maxConsecutiveFailsByUsername,                                          // maximum points to reach
    duration: 60 * 60 * 3,                                                          // Store number for three hours since first fail
    blockDuration: 60 * 30,                                                         // Block for 30 minutes
});

module.exports = async (req, res, next) => {

    const bufEmail = Buffer.from(req.body.email);                                   // get the email sent by the user then buff it
    const userEmail = bufEmail.toString('hex');                                     // get the email sent by the user
    const userIp = req.ip;                                                          // get the ip from the request
    const rlUser = await rateLimiter.get(userEmail);                                // get the existing email in the database set on the rate limiter key
    const rlIp = await rateLimiter.get(userIp);                                     // get the user Ip set in the rate limiter key

    User.findOne({ email: userEmail })                                              // find the unique email 
    .then(user => {
        if (!user) {
            rateLimiter.consume(req.ip)                                             // one point added for every email searching failure, user ip added to the limiter key
            .then(() => {
                next();
            }).catch(_ => {
                res.status(429).json({ message: 'too many tries, please try again later' });
            })
            return false;

        }else if (rlIp && rlIp.consumedPoints > maxConsecutiveFailsByUsername) {    

            return res.status(429).json({ message: 'too many tries, please try again later' });

        }else if (rlIp && rlIp.consumedPoints < maxConsecutiveFailsByUsername) {    
            rateLimiter.delete(userIp);                                                                 // reboot tries if the user has been found with less than 5 tries
        }
        bcrypt.compare(req.body.password, user.password)                                                // compare passwords between entered hash and data base hash
        .then(valid => {
            if (!valid) {
                rateLimiter.consume(userEmail)                                                          // one point added for every passwords searching failure, user email added to the limiter key
                    .then(() => {
                        next();
                    }).catch(_ => {
                        res.status(429).json({ message: 'this account has been blocked, please try again later'});
                    })
            }else if (rlUser && rlUser.consumedPoints > maxConsecutiveFailsByUsername) {

                return res.status(429).json({ message: 'this account has been blocked, please try again later'});

            }else if (rlUser && rlUser.consumedPoints < maxConsecutiveFailsByUsername) {
                rateLimiter.delete(userEmail);                                                          // reboot tries if the password has been found with less than 5 tries
                next();
            }else {
                next();
            }
        }).catch(error => res.status(500).json({ error }));
    }).catch(error => res.status(500).json({ error }));
}