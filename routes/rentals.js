const express = require("express");
const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const auth = require('../middleware/auth');
const Fawn = require("fawn");
const mongoose = require("mongoose");
const router = express.Router();


Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort("rentalDate");
    res.send(rentals);
});

//should be protected by the auth middleware
router.post('/', async (req, res) => {
    const { error } = validate(req.body);

    if (error)
        return res.status(400).send(error.details[0].message);

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid movie");

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid customer");

    if (movie.numberInStock == 0)
        return res.status(500).send("Movie not in stock");

    let rental = new Rental({
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        }
    });
    try {
        const task = Fawn.Task();
        task.save('rentals', rental);
        task.update('movies', { _id: movie._id }, { $inc: { "numberInStock": -1 } });
        task.run();
        /*
        rental = await rental.save();
        await movie.update({ $inc: { "numberInStock": -1 } });
        */
        res.send(rental);
    }
    catch (ex) {
        res.status(500).send("DB transaction failed");
        console.log(ex.message);
    }


});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).send('The rental with the given ID was not found.');

    res.send(rental);
});

module.exports = router;