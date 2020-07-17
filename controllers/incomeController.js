const Income = require("../models/income");
const Category = require("../models/category");

exports.getIncomeList = async (request, response) => {
    try {
        const wallet = request.wallet;
        const incomeList = await Income.find({ wallet: wallet._id });
        response.status(200).json({
            status: "Success",
            data: incomeList
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.getIncome = async (request, response) => {
    try {
        const incomeId = request.params.incomeId;
        const income = await Income.findById({ _id: incomeId });
        response.status(200).json({
            status: "Success",
            data: income
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.createIncome = async (request, response) => {
    try {
        const user = request.user;
        const wallet = request.wallet;
        let { amount, description, date, categoryId } = request.body;
        if (!amount || !description || !date || !categoryId) throw new Error("Amount, description, date and categoryId are required");
        const category = await Category.findById({ _id: categoryId });
        if (!category) throw new Error("Undefined category");
        const income = await Income.create({
            category: category,
            user: user,
            wallet: wallet,
            description: description,
            date: date,
            amount: amount
        });
        wallet.balance = wallet.balance + income.amount;
        await wallet.save();
        response.status(200).json({
            status: "Success",
            data: { income, wallet }
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.updateIncome = async (request, response) => {
    try {
        const wallet = request.wallet;
        const incomeId = request.params.incomeId;
        const income = await Income.findById({ _id: incomeId });
        if (!income) throw new Error("Undefined expense");
        let { amount, description, date, categoryId } = request.body;
        const oldAmount = income.amount;
        if (description) income.description = description;
        if (date) income.date = date;
        if (categoryId) income.categoryId = categoryId;
        if (amount) {
            income.amount = amount
            wallet.balance = wallet.balance - oldAmount + amount;
        };
        await income.save();
        await wallet.save();
        response.status(200).json({
            status: "Success",
            data: { income, wallet }
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.deleteIncome = async (request, response) => {
    try {
        const wallet = request.wallet;
        const incomeId = request.params.incomeId;
        const income = await Income.findById({ _id: incomeId });
        wallet.balance = wallet.balance - income.amount;
        await wallet.save();
        await income.remove();
        response.status(200).json({
            status: "Success",
            data: { wallet }
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};