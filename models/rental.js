const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi)

const Rental = mongoose.model('Rental', mongoose.Schema({

    customer: {
        type: mongoose.Schema({
            name: { type: String, required: true },
            phone: { type: String, required: true },
            isGold: { type: Boolean, required: true }
        }),
        required: true

    },
    movie: {
        type: mongoose.Schema({
            title: { type: String, required: true },
            dailyRentalRate: { type: Number, required: true }
        }),
        required: true

    },
    dateOut: { type: Date, required: true, default: new Date().getTime() },
    dateReturned: { type: Date }

}));

function validate_rental(input) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    });

    return schema.validate(input);
}


module.exports.Rental = Rental;
module.exports.validate = validate_rental;
