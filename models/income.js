const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        require: [true, "Must choose 1 category"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        require: [true, "Must belong to 1 user"]
    },
    wallet: {
        type: mongoose.Schema.ObjectId,
        ref: "Wallet",
        require: [true, "Must belong to 1 wallet"]
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        require: [true, "Date is required"]
    },
    amount: {
        type: Number,
        require: [true, "Must have amount"]
    }
}, {
    timestamps: true
});

const Income = mongoose.model("Income", incomeSchema);
module.exports = Income;