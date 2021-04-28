/*****  set regexp for inputs  *****/

const emailRegExp = /^[\w-.éèîïàçùüöôœ]{1,40}[@]{1}[\w-éèîïàçùüöôœ]{1,40}[.]{1}[a-z]{2,3}$/;
const nameRegExp = /^[\w-., !'éèîïÉÈÎÏàçùüöôœÀÇÙÜÖÔ]{1,100}$/;
const globalRegExp = /^[\w-.,\s\n\(\)!'"\?éèîïÉÈÎÏàçùüöôœÀÇÙÜÖÔ]{1,300}$/;

exports.user = (req, res, next) => {
    if (emailRegExp.test(req.body.email) === false || nameRegExp.test(req.body.password) === false) {
        return res.status(401).json({ message: 'Bad Request' });
    }else {
        next();
    };
};

exports.sauces = (req, res, next) => {
    if (nameRegExp.test(req.body.name) && nameRegExp.test(req.body.manufacturer) && globalRegExp.test(req.body.description) && nameRegExp.test(req.body.mainPepper)) {
        next();
    } else {
        return res.status(401).json({ message: 'Bad Request' });
    };
};
