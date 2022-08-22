const express = require('express');
const AdModel = require('../models/ad');
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

const router = express.Router();

//SHOW ALL ADS
router.get('/show', async (request, response) => {
    //const ads = await AdModel.find({});

    const authHeaderInfo = request.headers['authorization'];
    if (authHeaderInfo == undefined) {
        return response.status(401).send("No token was provided!");
    }

    const token = authHeaderInfo.split(' ')[1];
    if (token == undefined) {
        return response.status(401).send("Proper token was not provided!");
    }

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const ads = await AdModel.find({})
            .populate("seller", "name")
            .populate("buyer", "name")
            .populate("category", "name")
            .populate("interestedBuyers", "name")

        response.status(200).json(ads);
    }
    catch {
        return response.status(401).send("Invalid token  provided!");
    }

});


//CREATE a new AD
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

        //addind the Ad-ID to the seller profile
        await UserModel.updateOne({ _id: seller }, {
            $push: {
                "ads": saveAds.id
            }
        });

        response.status(201).send("Ad created with ID: " + saveAds.id);

    } catch (e) {
        response.status(501).send(e.message)
    }
});


//Delete AD
router.delete('/delete/:id', async (request, response) => {
    //console.log(request.params.id);
    try {
        await AdModel.deleteOne({ _id: request.params.id });
        response.status(202).send("Ad DELETED with ID: " + request.params.id);
    } catch (e) {
        response.status(501).send(e.message)
    }


})


//Interested Buyer Add
router.post('/:adId/buyers/:buyerId', async (request, response) => {
    //console.log(request.params.adId);
    try {
        await AdModel.updateOne({ _id: request.params.adId }, {
            $push: {
                "interestedBuyers": request.params.buyerId
            }
        });

        response.status(202).send("Buyer queued with ID: " + request.params.buyerId);
    } catch (e) {
        response.status(501).send(e.message)
    }
});


//Sold / Closed Ad
router.post('/:adId/sold/:buyerId', async (request, response) => {
    //console.log(request.params.adId);
    try {
        await AdModel.updateOne({ _id: request.params.adId }, {
            "closedAt": Date.now(),
            "buyer": request.params.buyerId
        });

        response.status(202).send("SOLD to Buyer with ID: " + request.params.buyerId);
    } catch (e) {
        response.status(501).send(e.message)
    }
})

module.exports = router;