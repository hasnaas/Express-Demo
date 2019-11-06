const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const genreSchema = require('./genre').genreSchema;

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A title of the movie is required'],
        minlength: [3, 'A movie title must be at least 3 caracters'],
        maxlength: [50, 'A movie title should not exceed 50 caracters']
    },
    numberInStock: {
        type: Number,
        default: 0,
        required: [true, 'Number of movies in stock must be specified']
    },
    dailyRentalRate: { type: Number, default: 0 },
    genreId: { type: genreSchema, required: true }

});
const Movie = mongoose.model('Movie', movieSchema);

function validate_movie(input) {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        numberInStock: Joi.number().min(0),
        dailyRentalRate: Joi.number().min(0),
        genreId: Joi.string().required()
    });

    return schema.validate(input);
}
module.exports.Movie = Movie;
module.exports.movieSchema = movieSchema;
module.exports.validate = validate_movie;