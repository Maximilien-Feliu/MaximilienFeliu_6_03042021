const Sauces = require('../models/Sauces');

exports.createSauces = (req, res, next) => {
    const sauces = new Sauces({
        userId: req.body.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        imageUrl: req.body.imageUrl,
        heat: req.body.heat,
        likes: req.body.likes,
        dislikes: req.body.dislikes,
        usersLiked: req.body.usersLiked,
        usersDisliked: req.body.usersDisliked
    });
    sauces.save().then(
        () => {
            res.status(201).json({
                message: 'post saved successfully !'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error
            });
        }
    );
};

exports.getAllSauces = (req, res, next) => {
    Sauces.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
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
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error
            });
        }
    );
};

