/**************  data schema for a user
         _id automatically generated by mongoose  *************/

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');           // package to prevalidate the user's informations

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },              // the email is strictly unique
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);                                     // with this plugin and the 'unique' value, the user cannot share the same email address

module.exports = mongoose.model('User', userSchema);                    // export the user model