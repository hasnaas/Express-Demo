const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const genreSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A name of the genre is required'],
        minlength: [3, 'A genre name must be at least 3 caracters'],
        maxlength: [50, 'A genre name should not exceed 50 caracters']
    }
});
const Genre = mongoose.model('Genre', genreSchema);

function validate_genre(input) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(input);
}
module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
module.exports.validate = validate_genre;