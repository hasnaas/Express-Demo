const { User } = require("../models/user");
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const _ = require("lodash");
const express = require("express");
const router = express.Router();


function validate(authObject) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.required()
    });


    return schema.validate(authObject);
}

//logging in 
router.post('/', async (req, res) => {
    const { error } = validate(req.body);

    if (error)
        return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send("Invalid email or password");

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match)
        return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});


module.exports = router;