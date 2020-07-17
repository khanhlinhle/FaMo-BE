const Wallet = require("../models/wallet");

exports.getWalletList = async (request, response) => {
    try {
        const family = request.family;
        const walletList = await Wallet.findById({ family: family._id });
        if (!walletList) throw new Error("Undefined wallet list");
        response.status(200).json({
            status: "Success",
            data: walletList
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.getWallet = async (request, response) => {
    try {
        const wallet = request.wallet;
        response.status(200).json({
            status: "Success",
            data: wallet
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.createWallet = async (request, response) => {
    try {
        const { type, balance, name } = request.body;
        if (!type || !balance) throw new Error("Type and balance are required");
        const family = request.family;
        const familyWallet = await Wallet.create({
            type: type,
            name: name,
            balance: balance,
            family: family._id
        });
        family.wallets.push(familyWallet);
        await family.save();
        response.status(200).json({
            status: "Success",
            data: { familyWallet, family }
        });
    } catch (error) {
        response.status(400).json({
            status: "Success",
            message: error.message
        });
    };
};

exports.updateWallet = async (request, response) => {
    try {
        const { type, name, balance } = request.body;
        if (!type || !balance) throw new Error("Type and balance are required");
        const wallet = request.wallet;
        if (type) wallet.type = type;
        if (name) wallet.name = name;
        await wallet.save();
        response.status(200).json({
            status: "Success",
            data: wallet
        });
    } catch (error) {
        response.status(400).json({
            status: "Success",
            message: error.message
        });
    };
};

exports.deleteWallet = async (request, response) => {
    try {
        const wallet = request.wallet;
        await wallet.remove();
        response.status(200).json({
            status: "Success",
            data: null
        });
    } catch (error) {
        response.status(400).json({
            status: "Success",
            message: error.message
        });
    };
};

exports.getPersonalWalletList = async (request, response) => {
    try {
        const user = request.user;
        const personalWalletList = await Wallet.findById({ user: user._id });
        response.status(200).json({
            status: "Success",
            data: personalWalletList
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.getPersonalWallet = async (request, response) => {
    try {
        const personalWallet = request.personalWallet;
        response.status(200).json({
            status: "Success",
            data: personalWallet
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.createPersonalWallet = async (request, response) => {
    try {
        const { name, balance, type } = request.body;
        if (!balance || !type) throw new Error("Balance and type are required");
        const user = request.user;
        const personalWallet = await Wallet.create({
            name: name,
            balance: balance,
            type: type,
            user: user._id
        });
        response.status(200).json({
            status: "Success",
            data: { personalWallet, user }
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.updatePersonalWallet = async (request, response) => {
    try {
        const { name, type, balance } = request.body;
        if (!type || !balance) throw new Error("Type and balance are required");
        const personalWallet = request.personalWallet;
        if (name) personalWallet.name = name;
        if (type) personalWallet.type = type;
        if (balance) personalWallet.balance = balance;
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.deletePersonalWallet = async (request, response) => {
    try {
        const personalWallet = request.personalWallet;
        await personalWallet.remove();
        response.status(200).json({
            status: "Success",
            data: null
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};



