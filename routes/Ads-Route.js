const express = require('express');
const AdModel = require('../models/ad');

const router = express.Router();


router.get('/show', async (request, response) => {
    const ads = await AdModel.find({});
    response.status(200).json(ads);
});

router.post('/new', async (request, response) => {
    const { name } = request.body;
    if (!name) {
        return response.status(400).send('Input required!');
    }
    //creating document/Category for entered details
    const newCat = new AdModel({
        name,
    });

    try {
        //saving the doc/Category to database collection
        const saveCat = await newCat.save();
        response.status(201).send("Category created with ID: " + saveCat.id);
    } catch (e) {
        response.status(501).send(e.message)
    }
});

module.exports = router;