const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
//const PasswordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');
const config = require('config');

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Username is required"],
        minlength: [3, "Username is 3 caracters minimum"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [3, "Password is 3 caracters minimum"]
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("JWTprivateKey"));
}
const User = mongoose.model('User', userSchema);

function validate_user(userObject) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(3).required()
        /*
        password: new PasswordComplexity({
            min: 4,
            max: 30,
            lowerCase: 1,
            upperCase: 1,
            numeric: 1,
            requirementCount: 4
        }).required()
        */
    });


    return schema.validate(userObject);
}

module.exports.User = User;
module.exports.validate = validate_user;
