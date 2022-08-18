const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    ads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ad',
    }]
});

const UserModel = new mongoose.model("User", userSchema);
module.exports = UserModel;