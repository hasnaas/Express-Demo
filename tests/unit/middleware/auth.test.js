const auth = require("../../../middleware/auth");
const { User } = require("../../../models/user");

describe("Unit testing the authentication middleware", () => {

    test("It populate request with the user object", () => {
        const user = new User({ "name": "karim", "isAdmin": true, "email": "karim@mail.com" });
        const req = {
            header: jest.fn(() => {
                return user.generateAuthToken();
            })
        }
        const res = jest.fn();
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toMatchObject({ _id: user._id.toHexString(), isAdmin: true });
    })

})