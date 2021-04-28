/*****  set a password format  *****/

const PasswordValidator = require('password-validator');

const password = new PasswordValidator();

password
.is().min(8)                                            // min length 8
.is().max(100)                                          // max length 100
.has().uppercase()                                      // must have uppercase letters
.has().lowercase()                                      // must have lowercase letters
.has().digits()                                         // must have at least one digit
.has().not().spaces()                                   // should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']);         // blacklist these values

module.exports = (req, res, next) => {
    if (!password.validate(req.body.password)) {
        return res.status(401).json({ message: 'incorrect password format' });
    }else {
        next();
    }
}