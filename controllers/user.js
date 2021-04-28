/*********************
                    functions for each user's routes
                                                *******************/


const bcrypt = require('bcrypt');               // package to create hashes for passwords
const jwt = require('jsonwebtoken');            // import the token package
const User = require('../models/User');         // import the user model

/*****  create a new user   *****/
exports.signup = (req, res, next) => {

    const bufEmail = Buffer.from(req.body.email);                                   // handle raw binary data

/*****  hash the password then save informations *****/
    bcrypt.hash(req.body.password, 10)                                              // 10 is the salt (how many times the hashage has to be executed)
    .then(hash => {
        const user = new User({
            email: bufEmail.toString('hex'),                                        // encode the buffed data
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message : 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

/*****  login a user  *****/
exports.login = (req, res, next) => {

    const bufEmail = Buffer.from(req.body.email);

    User.findOne({ email: bufEmail.toString('hex') })                               // find the unique email 
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'});
        }
        bcrypt.compare(req.body.password, user.password)                            // compare passwords between entered hash and data base hash
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe inccorect !'});
            }
            res.status(200).json({                                                  // return a userId and a token if everything is ok
                userId: user._id,
                token: jwt.sign(                                                    // give the token to connect only one time and return the token for authentifying each requests
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
};