const Sauces = require('../models/Sauces');

exports.getAllSauces = (req, res, next) => {
    Sauces.find().then(
        (sauces) => {
            res.status(200).JSON(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).JSON({
                error
            });
        }
    );
};

exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({
        _id: req.params.id
    }).then(
        (sauces) => {
            res.status(200).JSON(sauces);
        }
    ).catch(
        (error) => {
            res.status(404).JSON({
                error
            });
        }
    );
};

