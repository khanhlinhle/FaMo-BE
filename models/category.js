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
    },
    type: {
        type: String,
        enum: ["Expense", "Income"],
        required: [true, "Type is required"]
    }
}, {
    timestamps: true
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;