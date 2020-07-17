const Family = require("../models/family");
const User = require("../models/user");
const Wallet = require("../models/wallet");

exports.getFamily = async (request, response) => {
    try {
        const user = request.user;
        const family = await Family.find({ users: user });
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
        const user = request.user;
        const family = await Family.create({
            users: [user]
        });
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

exports.addFamilyMember = async (request, response) => {
    try {
        const user = request.user;
        const { familyId, memberId } = request.body;
        if (!familyId || !memberId) throw new Error("FamilyID and memberID are required");
        const family = await Family.findById({ _id: familyId });
        if (!family) throw new Error("Undefined family");
        if (!family.users.filter(item => item === user._id)) throw new Error("User is not allowed to update");
        const member = await User.findById({ _id: memberId });
        if (!member) throw new Error("Undefined member");
        if (!family.users.filter(item => item === memberId)) return family.users.push(memberId);
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
        const { familyId, memberId } = request.body;
        if (!familyId || !memberId) throw new Error("FamilyID and memberID are required");
        const family = await Family.findById({ _id: familyId });
        if (!family) throw new Error("Undefined family");
        const member = await User.findById({ _id: memberId });
        if (!member) throw new Error("Undefined member");
        if (!family.users.filter(item => item === user._id)) throw new Error("User is not allowed to update");
        family.users = family.users.filter(item => item !== memberId);
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