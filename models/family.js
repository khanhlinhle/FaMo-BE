const mongoose = require("mongoose");

const familySchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    wallets: [{
        type: mongoose.Schema.ObjectId,
        ref: "Walet"
    }],
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        unique: true
    }
}, {
    timestamps: true
});

const Family = mongoose.model("Family", familySchema);
module.exports = Family;