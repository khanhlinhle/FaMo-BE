const Expense = require("../models/expense");
const Category = require("../models/category");

exports.getExpenseList = async (request, response) => {
    try {
        const wallet = request.wallet;
        const expenseList = await Expense.find({ wallet: wallet._id });
        response.status(200).json({
            status: "Success",
            data: expenseList
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.getExpense = async (request, response) => {
    try {
        const expenseId = request.params.expenseId;
        const expense = await Expense.findById({ _id: expenseId });
        response.status(200).json({
            status: "Success",
            data: expense
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.getExpenseReport = async (request, response) => {
    try {
        const { wallets } = request.body;
        let expenseList = [];

        for (const wallet of wallets) {
            let list = await Expense.find({ wallet: wallet._id });
            expenseList = [...expenseList, ...list];
        }

        console.log('wallets ', wallets);
        console.log('expenseList ', expenseList);

        response.status(200).json({
            status: "Success",
            data: expenseList
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.createExpense = async (request, response) => {
    try {
        const user = request.user;
        const wallet = request.wallet;
        let { amount, description, date, category } = request.body;
        if (!amount || !date || !category) throw new Error("Amount, description, date and categoryId are required");
        const existCategory = await Category.findById({ _id: category });
        if (!existCategory) throw new Error("Undefined category");
        const expense = await Expense.create({
            category: existCategory,
            user: user,
            wallet: wallet,
            description: description,
            date: date,
            amount: amount
        });
        wallet.balance = wallet.balance - expense.amount;
        await wallet.save();
        response.status(200).json({
            status: "Success",
            data: { expense, wallet }
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.updateExpense = async (request, response) => {
    try {
        const wallet = request.wallet;
        const expenseId = request.params.expenseId;
        const expense = await Expense.findById({ _id: expenseId });
        if (!expense) throw new Error("Undefined expense");
        let { amount, description, date, categoryId } = request.body;
        const oldAmount = expense.amount;
        if (description) expense.description = description;
        if (date) expense.date = date;
        if (categoryId) expense.categoryId = categoryId;
        if (amount) {
            expense.amount = amount
            wallet.balance = wallet.balance + oldAmount - amount;
        };
        await expense.save();
        await wallet.save();
        response.status(200).json({
            status: "Success",
            data: { expense, wallet }
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.deleteExpense = async (request, response) => {
    try {
        console.log(request.body)
        const wallet = request.wallet;
        const expenseId = request.params.expenseId;
        const expense = await Expense.findById({ _id: expenseId });
        wallet.balance = wallet.balance + expense.amount;
        await wallet.save();
        await expense.remove();
        const expenseList = await Expense.find({});
        response.status(200).json({
            status: "Success",
            data: { wallet, expenseList }
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};