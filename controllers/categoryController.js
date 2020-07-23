const Category = require("../models/category");

exports.createCategory = async (request, response) => {
    try {
        const { name, parent, type } = request.body;
        if (!name || !type) throw new Error("Name and type are required");
        const category = await Category.create({
            name: name,
            parent: parent,
            type: type
        });
        response.status(200).json({
            status: "Success",
            data: category
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.getCategoryList = async (request, response) => {
    try {
        const categoryList = await Category.find({}).populate("category", "name");
        response.status(200).json({
            status: "Success",
            data: categoryList
        });
    } catch (error) {
        response.status(400).json({
            status: "Success",
            message: error.message
        });
    };
};