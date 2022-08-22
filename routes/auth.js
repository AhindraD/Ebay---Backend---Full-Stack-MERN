//const { request, response } = require('express');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user')

const router = express.Router();

router.post('/signup', async (request, response) => {
    //console.log('SIGN Up request received!', request.body);
    //response.send('Under Construction!')
    const { name, email, password, confirmPassword } = request.body;
    if (!email || !name || !password || !confirmPassword) {
        return response.status(400).send('All fields are required!');
    }
    if (password !== confirmPassword) {
        return response.status(400).send('password & confirmPassword does not match');
    }

    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser != null) {
        return response.status(400).send('Email already exists!');
    }

    //Generate password HASH
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    //creating document/account for entered details
    const newUser = new UserModel({
        name,
        email,
        password: hash,
    });

    try {
        //saving the doc/account to database collection
        const saveUser = await newUser.save();
        response.status(201).send("User created with ID: " + saveUser.id);
    } catch (e) {
        response.status(501).send(e.message)
    }
});

router.post('/login', async (request, response) => {
    const { email, password } = request.body;
    if (!email || !password) {
        return response.status(400).send('All fields are required!');
    }

    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser == null) {
        return response.status(400).send('Email does not exist!');
    }

    //Compare password HASH
    const ifCorrectPassword = await bcrypt.compare(password, existingUser.password);
    if (!ifCorrectPassword) {
        response.status(400).send("Invalid Password Provided!");
    } else {

        const payload = {
            id: existingUser.id,
            email: existingUser.email,
        }

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)

        response.status(200).json({ accessToken, existingUser });
        // response.status(200).json(existingUser.toJSON());
    }
});


module.exports = router;