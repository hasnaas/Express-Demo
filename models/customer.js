const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

function validate_body(data) {
    let joi = Joi.object({
        name: Joi.string().min(3).required(),
        phone: Joi.string().required().pattern(/^[0-9]{6}$/),
        isGold: Joi.boolean()
    });

    return joi.validate(data);
}

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Customer name is required"],
        minlength: [3, "Customer name is 3 caracters minimum"]
    },
    phone: {
        type: String,
        required: [true, "Customer phone is required"],
        validate: {
            validator: function (p) {
                return /^[0-9]{6}$/.test(p);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    isGold: {
        type: Boolean,
        default: false
    }
});
const Customer = mongoose.model('Customer', customerSchema);

module.exports.Customer = Customer;
module.exports.customerSchema = customerSchema;
module.exports.validate = validate_body;