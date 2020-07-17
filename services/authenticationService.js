const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Family = require("../models/family");
const Wallet = require("../models/wallet");

exports.generateToken = async (user) => {
    const token = jwt.sign({
        _id: user._id
    },
        process.env.SECRET,
        { expiresIn: "7d" }
    );
    user.tokens.push(token);
    await user.save();
    return token;
};

exports.loginWithEmail = async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Undefined user");
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Wrong email or password");
    return user;
};

exports.loginRequired = async (request, response, next) => {
    if (!request.headers.authorization || !request.headers.authorization.startsWith("Bearer ")) {
        return response.status(401).json({
            status: "Fail",
            error: "Unauthorized"
        });
    };
    const token = request.headers.authorization.replace("Bearer ", "");
    try {
        const decode = jwt.verify(token, process.env.SECRET);
        const user = await User.findOne({ _id: decode._id, tokens: token });
        if (!user) throw new Error("Unauthorized");
        request.user = user;
        request.token = token;
        next();
    } catch (error) {
        response.status(401).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.canAccessFamily = async (request, response, next) => {
    try {
        const user = request.user;
        let { familyId } = request.body;
        if (!familyId) familyId = request.params.familyId;
        const family = await Family.findById({ _id: familyId });
        if (!family) throw new Error("Undefined family");
        if (!family.users.filter(item => item === user._id)) throw new Error("Can not access family");
        request.family = family;
        next();
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.canAccessWallet = async (request, response, next) => {
    try {
        const user = request.user;
        const family = request.family;
        let { walletId } = request.body;
        if (!walletId) walletId = request.params.walletId;
        const wallet = await Wallet.findById({ _id: walletId });
        if (!wallet) throw new Error("Undefined wallet");
        if (!family.users.filter(item => item === user._id)) throw new Error("Can not access this family");
        if (!family.wallets.filter(item => item === walletId)) throw new Error("Can not access this wallet");
        request.wallet = wallet;
        next();
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};

exports.canAccessPersonalWallet = async (request, response, next) => {
    try {
        const user = request.user;
        const { walletId } = request.body;
        if (!walletId) walletId = request.params.walletId;
        const personalWallet = await Wallet.findById({ _id: walletId });
        if (!personalWallet) throw new Error("Undefined personal wallet");
        if (!user._id === personalWallet.user) throw new Error("Can not access this personal wallet");
        request.personalWallet = personalWallet;
        next();
    } catch (error) {
        response.status(400).json({
            status: "Fail",
            message: error.message
        });
    };
};