const mongoose = require("mongoose")
//
const adSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    sellerID: {
        type: Number,
        required: true,
    },
    categoryID: {
        type: Number,
        required: true,
    },
    interestedBuyers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ad',
    }],
    buyerID: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AdModel = mongoose.model("Ad", adSchema);
module.exports = AdModel;