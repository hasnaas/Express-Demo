//API for returns /api/returns/
/*
a return = a post method that, when provided with valid movie id and customer id,
updates the corresponding rental object with date returned and rental fees

*/
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const _ = require('lodash');
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();


router.post("/", auth, async (req, res) => {
    if (!req.body.customerId)
        return res.status(400).send("CustomerId not provided");

    if (!req.body.movieId)
        return res.status(400).send("movieId not provided");
    /*
        const movie = await Movie.findById(req.body.movieId);
        const customer = await Customer.findById(req.body.customerId);
        let rental = await Rental.findOne({ movie: _.pick(movie, ['_id', 'title', 'dailyRentalRate']), customer: _.pick(customer, ['_id', 'name', 'phone']) });
    */

    const rental = await Rental.findOne({ "customer._id": req.body.customerId, "movie._id": req.body.movieId });


    if (!rental)
        return res.status(404).send("No rental exist for these ID");

    if (rental.dateReturned)
        return res.status(400).send("This return is already processed");

    rental.return();
    await rental.save();

    await Movie.update({ _id: rental.movie._id }, { $inc: { "numberInStock": 1 } })

    const rentalInDb = await Rental.findById(rental._id);
    return res.status(200).send(rentalInDb);
})



module.exports = router;
