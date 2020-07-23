const Family = require("../models/family");
const User = require("../models/user");
const Wallet = require("../models/wallet");

exports.getFamily = async (request, response) => {
    try {
        const user = request.user;
        const family = await Family.find({ users: user }).populate("wallets", "type");
        response.status(200).json({
            status: "Success",
            data: family
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.createFamily = async (request, response) => {
    try {
        console.log(request.user)
        const { name } = request.body;
        console.log(name);
        if (!name) throw new Error("Name is required");
        const user = request.user;
        console.log("3");
        const family = await Family.create({
            users: [user],
            name: name
        });
        const cashWallet = await Wallet.create({
            balance: 0,
            type: "Cash"
        });
        family.wallets.push(cashWallet);
        const bankWallet = await Wallet.create({
            balance: 0,
            type: "Bank"
        });
        family.wallets.push(bankWallet);
        const creditWallet = await Wallet.create({
            balance: 0,
            type: "Credit"
        });
        family.wallets.push(creditWallet);
        console.log("4");
        await family.save();
        response.status(200).json({
            status: "Success",
            data: family
        });
    } catch (error) {
        response.status(400).json({
            status: "Success",
            message: error.message
        });
    };
};

exports.updateFamilyName = async (request, response) => {
    try {
        const { name } = request.body;
        const family = request.family;
        if (name) family.name = name;
        await family.save();
        response.status(200).json({
            status: "Success",
            data: family
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.addFamilyMember = async (request, response) => {
    try {
        const user = request.user;
        const { familyId, memberEmail } = request.body;
        if (!familyId || !memberEmail) throw new Error("FamilyID and memberEmail are required");
        const family = await Family.findById({ _id: familyId });
        if (!family) throw new Error("Undefined family");
        if (!family.users.filter(item => item === user._id)) throw new Error("User is not allowed to update");
        const member = await User.findOne({ email: memberEmail });
        if (!member) throw new Error("Undefined member");
        if (!family.users.filter(item => item === member._id)) return family.users.push(member._id);
        await family.save();
        response.status(200).json({
            status: "Success",
            data: family
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.addFamilyWallet = async (request, response) => {
    try {
        const user = request.user;
        const { familyId, familyWalletId } = request.body;
        if (!familyId || !familyWalletId) throw new Error("FamilyID and familyWalletID are required");
        const family = await Family.findById({ _id: familyId });
        if (!family) throw new Error("Undefined family");
        const familyWallet = await Wallet.findById({ _id: familyWalletId });
        if (!familyWallet) throw new Error("Undefined familyWallet");
        if (!family.users.filter(item => item === user._id)) throw new Error("User is not allowed to update");
        if (!family.wallets.filter(item => item === familyWalletId)) return family.wallets.push(familyWalletId);
        await family.save();
        response.status(200).json({
            status: "Success",
            data: family
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.removeFamilyMember = async (request, response) => {
    try {
        const user = request.user;
        const { familyId, memberEmail } = request.body;
        if (!familyId || !memberEmail) throw new Error("FamilyID and memberID are required");
        const family = await Family.findById({ _id: familyId });
        if (!family) throw new Error("Undefined family");
        const member = await User.findOne({ email: memberEmail });
        if (!member) throw new Error("Undefined member");
        if (!family.users.filter(item => item === user._id)) throw new Error("User is not allowed to update");
        family.users = family.users.filter(item => item !== member._id);
        await family.save();
        response.status(200).json({
            status: "Success",
            data: family
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.removeFamilyWallet = async (request, response) => {
    try {
        const user = request.user;
        const { familyId, familyWalletId } = request.body;
        if (!familyId || !familyWalletId) throw new Error("FamilyID and memberID are required");
        const family = await Family.findById({ _id: familyId });
        if (!family) throw new Error("Undefined family");
        const familyWallet = await Wallet.findById({ _id: familyWalletId });
        if (!familyWallet) throw new Error("Undefined familyWallet");
        if (!family.users.filter(item => item === user._id)) throw new Error("User is not allowed to update");
        family.wallets = family.wallets.filter(item => item !== familyWalletId);
        await family.save();
        response.status(200).json({
            status: "Success",
            data: family
        });
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};