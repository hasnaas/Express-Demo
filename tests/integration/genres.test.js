const request = require("supertest");
const { Genre } = require("../../models/genre");
const mongoose = require('mongoose');
const { User } = require("../../models/user");
let server;

describe("/api/genres", () => {

    beforeEach(() => {
        server = require("../../index");
        user = new User({ name: "test", email: "test@domain.com", password: "testpass", isAdmin: true });
        jwttoken = user.generateAuthToken();
    })
    afterEach(async () => {
        await server.close();
        await Genre.remove({});
    })

    describe("GET /", () => {
        test("it should return all genres", async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            const response = await request(server).get('/api/genres');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body.some(g => g.name == "genre1")).toBeTruthy();
            expect(response.body.some(g => g.name == "genre2")).toBeTruthy();
        });
    })

    describe("GET /:id", () => {

        test("it should return a 404 error if the genre id does not exist", async () => {
            const gid = new mongoose.Types.ObjectId().toHexString();
            const response = await request(server).get('/api/genres/' + gid);
            expect(response.status).toBe(404);
        });

        test("it should return a 404 error if the genre id is invalid", async () => {
            const response = await request(server).get('/api/genres/1');
            expect(response.status).toBe(404);
        });

        test("it should return the object corresponding to the provided id", async () => {
            const genre = new Genre({ name: "testgenre" });
            await genre.save();
            const response = await request(server).get('/api/genres/' + genre._id);
            expect(response.body).toMatchObject({ name: "testgenre" });
        });
    })

    describe("PUT /:id", () => {

        let jwttoken;
        let name;

        const exec = async (gid) => {
            return await request(server)
                .put('/api/genres/' + gid)
                .send({ name })
                .set("x-auth-token", jwttoken);
        }

        beforeEach(() => {
            const user = new User({ name: "test", email: "test@domain.com", password: "testpass", isAdmin: true });
            jwttoken = user.generateAuthToken();
            name = "newname";
        })

        test("it should return a 401 error if user is not logged in", async () => {
            jwttoken = '';
            const response = await exec("123");
            expect(response.status).toBe(401);
        })

        test("it should return a 404 error if the genre id is invalid", async () => {

            const response = await exec(1);

            expect(response.status).toBe(404);


        });

        test("it should return a 404 error if the genre id does not exist", async () => {

            const gid = new mongoose.Types.ObjectId().toHexString();
            const response = await exec(gid);

            expect(response.status).toBe(404);
        });


        test("it should update the object corresponding to the provided id", async () => {

            const genre = new Genre({ name: "testgenre" });
            await genre.save();
            const response = await request(server).get('/api/genres/' + genre._id);
            expect(response.body).toMatchObject({ name: "testgenre" });

            const response2 = await exec(genre._id);

            expect(response2.body).toMatchObject({ name: "newname" });


        });
    })


    describe("DELETE /:id", () => {

        test("it should return a 401 error if user is not logged in", async () => {
            const response = await request(server).delete('/api/genres/1')
            expect(response.status).toBe(401);
        })

        test("it should return a 404 error if the genre id is invalid", async () => {


            const response = await request(server)
                .delete('/api/genres/1')
                .set("x-auth-token", jwttoken)

            expect(response.status).toBe(404);


        });

        test("it should return a 404 error if the genre id does not exist", async () => {

            const gid = new mongoose.Types.ObjectId().toHexString();
            const response = await request(server)
                .delete('/api/genres/' + gid)
                .set("x-auth-token", jwttoken);

            expect(response.status).toBe(404);
        });


        test("it should delete the object corresponding to the provided id", async () => {

            const genre = new Genre({ name: "testgenre" });
            await genre.save();
            const response = await request(server).get('/api/genres/' + genre._id);
            expect(response.body).toMatchObject({ name: "testgenre" });

            const response2 = await request(server)
                .delete('/api/genres/' + genre._id)
                .set("x-auth-token", jwttoken);

            expect(response2.body).toMatchObject({ name: "testgenre" });

            const response3 = await request(server)
                .get('/api/genres/' + genre._id);

            expect(response3.status).toBe(404);

        });
    })

    describe("POST /", () => {

        let jwttoken;

        const exec = async (name) => {
            return await request(server)
                .post('/api/genres/')
                .send({ name })
                .set("x-auth-token", jwttoken);
        }

        beforeEach(() => {
            const user = new User({ name: "test", email: "test@domain.com", password: "testpass", isAdmin: true });
            jwttoken = user.generateAuthToken();

        })

        test("it should return a 401 error if user is not logged in", async () => {
            jwttoken = '';
            const response = await exec("newgenre")
            expect(response.status).toBe(401);
        })

        test("it should return a 400 error if the genre name is less than 3 caracters", async () => {


            const response = await await exec("g1");
            expect(response.status).toBe(400);
        })


        test("it should save the provided genre in the database if it is valid", async () => {

            await exec("genre1");
            //expect(response.body).toMatchObject({ name: "genre1" });
            const genre = await Genre.find({ name: 'genre1' });
            expect(genre).not.toBeNull();
        })

        test("it should return the created genre in the response", async () => {

            const response = await exec("genre1");

            expect(response.body).toMatchObject({ name: "genre1" });
            expect(response.body).toHaveProperty("_id");

        })


    })
})