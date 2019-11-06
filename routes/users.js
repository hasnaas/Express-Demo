const { User, validate } = require("../models/user");
const auth = require('../middleware/auth');
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require('lodash');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require("express");
const router = express.Router();


//registering a new user
router.post('/', async (req, res) => {
    const { error } = validate(req.body);

    if (error)
        return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
        return res.status(400).send("User already registered");

    const hash = await bcrypt.hash(req.body.password, saltRounds);
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash
    });
    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

//getting the currently logged in user
router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
})


module.exports = router;