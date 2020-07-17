const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    balance: {
        type: Number,
        required: [true, "Current amount is required"]
    },
    type: {
        type: String,
        enum: ["Bank", "Cash", "Credit"],
        required: [true, "Type is required"],
        trim: true
    },
    family: {
        type: mongoose.Schema.ObjectId,
        ref: "Family",
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

const Wallet = mongoose.model("Walet", walletSchema);
module.exports = Wallet;