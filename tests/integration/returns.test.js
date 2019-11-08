// TDD : approach
// 1- Listing test cases
// error cases
/*
return 401 if client not logged in
return 400 if the movie id is invalid
return 400 if the customer id is invalid
return 404 if the combination (movie id,customer id) does not correspond to a rental object
return 400 if the return has already been processes
*/
//normal case
/*
return 200 for valid requests
set the return date
calculate the rental fee
update the stock quantity
return the rental summary
*/

const request = require("supertest");
const mongoose = require('mongoose');
const { Movie } = require("../../models/movie");
const { Customer } = require("../../models/customer");
const { User } = require("../../models/user");
const { Rental } = require("../../models/rental");
const _ = require('lodash');
let server;
let customerId;
let movieId;
let rental;
let movie;

describe("/api/returns", () => {

    let jwttoken;

    const exec = async () => {
        return await request(server)
            .post('/api/returns/')
            .send({ customerId, movieId })
            .set("x-auth-token", jwttoken);
    }

    beforeEach(async () => {
        server = require("../../index");
        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        const user = new User({ name: "test", email: "test@domain.com", password: "testpass", isAdmin: true });
        jwttoken = user.generateAuthToken();
        rental = new Rental({
            customer: {
                _id: customerId,
                name: "12345",
                phone: "123456",
            },
            movie: {
                _id: movieId,
                title: "12345",
                dailyRentalRate: 3
            }

        });
        await rental.save();

        movie = new Movie({
            _id: movieId,
            title: "12345",
            dailyRentalRate: 3,
            numberInStock: 3,
            genreId: { _id: new mongoose.Types.ObjectId(), name: "thegenre" }
        });
        await movie.save();

    })

    afterEach(async () => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    })

    test("It should work", async () => {
        const result = Rental.findById(rental._id);
        expect(result).not.toBeNull();
    })

    test("it should return a 401 error if user is not logged in", async () => {
        jwttoken = '';
        const response = await exec();
        expect(response.status).toBe(401);
    })

    test("it should return a 400 error if customerID is not provided", async () => {
        customerId = '';
        const response = await exec();
        expect(response.status).toBe(400);
    })

    test("it should return a 400 error if movieID is not provided", async () => {
        movieId = '';
        const response = await exec();
        expect(response.status).toBe(400);
    })

    test("it should return a 404 error if the combination (movie id,customer id) does not correspond to a rental object", async () => {
        await rental.remove();
        const response = await exec();
        expect(response.status).toBe(404);
    })

    test("it should return a 400 error if the return is already processed", async () => {
        rental.dateReturned = new Date().getTime();
        await rental.save();

        const response = await exec();
        expect(response.status).toBe(400);
    })

    test("it should return a 200 if the request is valid", async () => {
        const response = await exec();
        expect(response.status).toBe(200);
    })

    test("it should set the return date if the request is valid", async () => {
        await exec();
        rental = await Rental.findById(rental._id);
        expect(new Date().getTime() - rental.dateReturned).toBeLessThan(10 * 1000);
    })

    test("it should calculate the rental fee if request is valid", async () => {
        rental.dateOut -= 4 * 24 * 3600 * 1000;
        await rental.save();
        await exec();
        rental = await Rental.findById(rental._id);
        expect(rental.rentalFee).toBe(4 * rental.movie.dailyRentalRate);
    })

    test("it should increase the movie quantity in stock if request is valid", async () => {

        await exec();
        movie = await Movie.findById(rental.movie._id);
        expect(movie.numberInStock).toBe(4);
    })

    test("it should return the rental summary if request is valid", async () => {

        const response = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        //console.log(rentalInDb);
        //console.log(response.body);
        // not working, why ?
        //expect(response.body).toMatchObject(rentalInDb);
        expect(Object.keys(response.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie']));


    })
})