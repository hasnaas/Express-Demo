const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");
const request = require("supertest");


describe("Authentication middleware", () => {
    beforeEach(() => { server = require("../../index") })
    afterEach(async () => {
        await Genre.remove({});
        await server.close();
    })


    test("it should return a 401 error if request is not authenticated", async () => {
        const response = await request(server)
            .post('/api/genres/')
            .send({ name: "genre1" });

        expect(response.status).toBe(401);
    })

    test("it should return a 400 error if token is invalid", async () => {
        const response = await request(server)
            .post('/api/genres/')
            .set("x-auth-token", "khdmkjqd1")
            .send({ name: "genre1" });

        expect(response.status).toBe(400);

    })

    test("it should forward the request if token is valid", async () => {
        const token = new User({ "name": "karim", "isAdmin": true, "email": "karim@mail.com" }).generateAuthToken();

        const response = await request(server)
            .post('/api/genres/')
            .set("x-auth-token", token)
            .send({ name: "genre1" });

        expect(response.body).toMatchObject({ name: "genre1" });

    })


})