const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Name is required"],
        trim: true
    },
    parent: {
        type: mongoose.Schema.ObjectId,
        ref: "Category"
    }
}, {
    timestamps: true
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;