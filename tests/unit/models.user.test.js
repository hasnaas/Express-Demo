const User = require('../../models/user').User;
const config = require('config');
const jwt = require('jsonwebtoken');

describe('User model', () => {

    test("generateAuthToken() should return a valid jwt for a user", () => {

        const user = new User({ name: "user", email: "user@domain.com", password: "upass", isAdmin: false })
        const uid = user._id.toHexString();
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get("JWTprivateKey"));
        expect(decoded).toMatchObject({ _id: uid, isAdmin: false });

    })

})