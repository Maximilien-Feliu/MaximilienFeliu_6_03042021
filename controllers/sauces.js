/********************
                functions for each sauces routes
                                            *************************/


const Sauce = require('../models/Sauce');       // import the sauce model
const fs = require('fs');                       // file system for downloading user's file

/*****  Create a new sauce  *****/
exports.createSauces = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);         // get the request body and transform it in js object
    delete sauceObject._id;                                 // delete the _id generated by the frontend

/*****  instantiate the sauce model  *****/
    const sauce = new Sauce({ 
        ...sauceObject,                                                                         // get informations from the user's form
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,           // get the image segment in the url
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()                                                                                // save to the database
    .then(
        () => {
            res.status(201).json({
                message: 'Sauce saved successfully !'
            });
        }
    ).catch(
        error => {
            res.status(400).json({
                error
            });
        }
    );
};

/*****  Modify an existing sauce  *****/
exports.modifySauce = (req, res, next) => {
    let sauceObject = {}; 
    req.file ?                                                                                      // search if a file exist in the request
    (
        Sauce.findOne({                                                                             // search the sauce by its id
            _id: req.params.id
        })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]                                    // get what comes after /images/ in the imageUrl (the filename)
            fs.unlink(`images/${filename}`, () => {                                                 // delete the file from the file system
                sauceObject = {                                                                     // create the new sauce object with the new file
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                }
                Sauce.updateOne({                                                                   // Update the sauce
                    _id: req.params.id
                }, {
                    ...sauceObject, _id: req.params.id
                })
                .then(
                    () => {
                        res.status(200).json({
                            message: 'Sauce updated successfully !'
                        });
                    }
                ).catch(
                    error => {
                        res.status(400).json({
                            error
                        });
                    }
                )
            })
        })
    ) : (                   
        sauceObject = {                                             // if a file doesn't exist
            ...req.body
        }
    )
    Sauce.updateOne({                                               // Update the sauce
        _id: req.params.id
    }, {
        ...sauceObject, _id: req.params.id
    })
    .then(
        () => {
            res.status(200).json({
                message: 'Sauce updated successfully !'
            });
        }
    ).catch(
        error => {
            res.status(400).json({
                error
            });
        }
    )
};

/*****  Delete an existing sauce  *****/
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({                                                 // find the sauce by its id
        _id: req.params.id
    })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];       // get what comes after /images/ in the imageUrl (the filename)
        fs.unlink(`images/${filename}`, () => {                     // delete the file from the file system
            Sauce.deleteOne({                                       // delete the file in the database
                _id: req.params.id
            })
            .then(
                () => {
                    res.status(200).json({
                        message: 'Sauce deleted successfully !'
                    });
                }
            ).catch(
                error => {
                    res.status(400).json({
                        error
                    });
                }
            );
        })
    })
    .catch(
        error => res.status(500).json({
            error
        })
    );
};

/*****  Get all sauces in data base  *****/
exports.getAllSauces = (req, res, next) => {
    Sauce.find()                                        // find sauces in the database
    .then(
        sauces => {                                     // return the array of all the sauces
            res.status(200).json(sauces);
        }
    ).catch(
        error => {
            res.status(400).json({
                error
            });
        }
    );
};

/*****  get one sauce by its id   *****/
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        sauce => {                                      // return the sauce
            res.status(200).json(sauce);
        }
    ).catch(
        error => {
            res.status(404).json({
                error
            });
        }
    );
};

/*****  Like or Dislike a sauce   *****/
exports.likeOrDislikeSauce = (req, res, next) => {

    /*****  like function  *****/
    if(req.body.like === 1) {
        Sauce.updateOne({                                   
            _id: req.params.id
        }, {
            $push: {
                usersLiked: req.body.userId                 // push the userId in the usersLiked array
            },
            $inc: {
                likes: +1                                   // increase one like
            }
        })
        .then(
            () => {
                res.status(200).json({
                    message: 'Sauce has been liked !'
                });
            }
        )
        .catch(
            error => {
                res.status(400).json({
                    error
                })
            }
        )
    }

    /*****  dislike function  *****/
    if(req.body.like === -1) {
        Sauce.updateOne({                                      
            _id: req.params.id
        }, {
            $push: {        
                usersDisliked: req.body.userId                  // push the userId in the usersDisliked array
            },
            $inc: {
                dislikes: +1                                    // increase one dislike
            }
        })
        .then(
            () => {
                res.status(200).json({
                    message: 'Sauce has been disliked !'
                });
            }
        )
        .catch(
            error => {
                res.status(400).json({
                    error
                })
            }
        )
    }

    /*****  like canceled function  *****/
    if(req.body.like === 0) {
        Sauce.findOne({
            _id: req.params.id
        })
        .then((sauce) => {
            if(sauce.usersLiked.includes(req.body.userId)){             // if the userId is in the array of usersLiked
                Sauce.updateOne({
                    _id: req.params.id
                }, {
                    $pull: {
                        usersLiked: req.body.userId                     // get the userId off the usersLiked array
                    },
                    $inc: {
                        likes: -1                                       // decrease one like 
                    }
                })
                .then(
                    () => {
                        res.status(200).json({
                            message: 'Like retired !'
                        });
                    }
                )
                .catch(
                    error => {
                        res.status(400).json({
                            error
                        })
                    }
                )
            }

            /*****  dislike canceled function  *****/
            if(sauce.usersDisliked.includes(req.body.userId)) {         // if the userId is in the array of usersDisliked
                Sauce.updateOne({
                    _id: req.params.id
                }, {
                    $pull: {
                        usersDisliked: req.body.userId                  // get the userId of the array of usersDisliked
                    },
                    $inc: {
                        dislikes: -1                                    // decrease one dislike
                    }
                })
                .then(
                    () => {
                        res.status(200).json({
                            message: 'Dislike retired !'
                        });
                    }
                )
                .catch(
                    error => {
                        res.status(400).json({
                            error
                        })
                    }
                )
            }
        })
        .catch(
            error => {
                res.status(404).json({
                    error
                })
            }
        )
    }
}