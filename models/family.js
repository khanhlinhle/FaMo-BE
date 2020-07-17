const mongoose = require("mongoose");

const familySchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    wallets: [{
        type: mongoose.Schema.ObjectId,
        ref: "Wallet"
    }]
}, {
    timestamps: true
});

const Family = mongoose.model("Family", familySchema);
module.exports = Family;