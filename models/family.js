const mongoose = require("mongoose");

const familySchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    wallets: [{
        type: mongoose.Schema.ObjectId,
        ref: "Wallet"
    }],
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    }
}, {
    timestamps: true
});

const Family = mongoose.model("Family", familySchema);
module.exports = Family;