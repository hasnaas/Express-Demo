const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi)

let rentalSchema = new mongoose.Schema({

    customer: {
        type: mongoose.Schema({
            name: { type: String, required: true },
            phone: { type: String, required: true },
            isGold: { type: Boolean, default: false }
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
    dateOut: { type: Number, required: true, default: new Date().getTime() },
    dateReturned: { type: Number },
    rentalFee: { type: Number }

});

rentalSchema.methods.return = function () {
    this.dateReturned = new Date().getTime();
    let fees = Math.round((this.dateReturned - this.dateOut) / (1000 * 60 * 60 * 24)) * this.movie.dailyRentalRate;
    this.rentalFee = fees;
}

const Rental = mongoose.model('Rental', rentalSchema);

function validate_rental(input) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    });

    return schema.validate(input);
}


module.exports.Rental = Rental;
module.exports.validate = validate_rental;
