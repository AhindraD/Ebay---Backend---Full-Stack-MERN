const express = require('express');
const AdModel = require('../models/ad');

const router = express.Router();


router.get('/show', async (request, response) => {
    const ads = await AdModel.find({});
    response.status(200).json(ads);
});

router.post('/new', async (request, response) => {
    const { title, desc, price, seller, category } = request.body;

    if (!title || !desc || !price || !seller || !category) {
        return response.status(400).send('Input required!');
    }
    //creating document/Ads for entered details
    const newAds = new AdModel({
        title,
        desc,
        price,
        seller,
        category,
    });

    try {
        //saving the doc/Ads to database collection
        const saveAds = await newAds.save();
        response.status(201).send("Ad created with ID: " + saveAds.id);
    } catch (e) {
        response.status(501).send(e.message)
    }
});

router.delete('/delete/:id', async (request, response) => {
    //console.log(request.params.id);
    try {
        await AdModel.deleteOne({ _id: request.params.id }, { active: false });
        response.status(202).send("Ad DELETED with ID: " + request.params.id);
    } catch (e) {
        response.status(501).send(e.message)
    }
})

module.exports = router;