const User = require("../models/user");
const saltRounds = 10;
const bcrypt = require("bcrypt");
const { generateToken, loginWithEmail } = require("../services/authenticationService");
const axios = require("axios");

exports.getUsersList = async (request, response) => {
    const usersList = await User.find({});
    response.status(200).json({
        status: "Success",
        data: usersList
    });
};

exports.createUser = async (request, response) => {
    try {
        const { firstName, lastName, email, password } = request.body;
        if (!firstName || !lastName || !email || !password) throw new Error("First name, last name, email & password are required");
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword
        });
        const token = await generateToken(user)
        response.status(201).json({
            status: "Success",
            data: { user, token }
        });
    } catch (error) {
        response.status(400).json({
            status: "Failed",
            message: error.message
        });
    };
};

exports.getMyProfile = async (request, response) => {
    const user = request.user
    response.status(200).json({
        status: "Success",
        data: user
    });
};

exports.updateMyProfile = async (request, response) => {
    try {
        const { firstName, lastName, password, email } = request.body;
        const user = request.user;
        if (firstName) {
            user.firstName = firstName;
        };
        if (lastName) {
            user.lastName = lastName;
        };
        if (password) {
            user.password = password;
        };
        if (email) {
            user.email = email;
        };
        await user.save();
        response.status(200).json({
            status: "Success",
            data: user
        });
    } catch (error) {
        response.status(400).json({
            status: "Success",
            message: error.message
        });
    };
};

exports.logIn = async (request, response) => {
    const { email, password } = request.body.account;
    if (!email || !password) throw new Error("Email and password are required");
    const user = await loginWithEmail(email, password);
    const token = await generateToken(user);
    response.status(200).json({
        status: "Success",
        data: { user, token }
    });
};

exports.logOut = async (request, response) => {
    const token = request.token;
    if (!token) throw new Error("Token is required");
    const user = request.user;
    user.token = user.tokens.filter(elm => elm !== token);
    await user.save();
    response.status(200).json({
        status: "Success",
        data: user
    });
};

exports.logInWithFacebook = async (request, response) => {

    try {
        const { fbToken } = request.query;

        if (!fbToken) throw new Error("Token is missing")
        const data = await axios.get(
            `https://graph.facebook.com/v7.0/me?fields=id%2Cname%2Cemail&access_token=${fbToken}`
        );
        const info = data.data;
        const words = info.name.split(" ");
        let user = await User.findOne({ email: info.email });
        if (!user) user = await User.create({
            email: info.email,
            firstName: words.pop(),
            lastName: words.join(" ")
        });
        const token = await generateToken(user);
        console.log(user, token)
        response.status(200).json({
            status: "Success",
            data: { user, token }
        });
    } catch (error) {
        console.log(error);
    };
};

exports.logInWithGoogle = async (request, response) => {
    try {
        const { googleToken } = request.body;
        if (!googleToken) throw new Error("Token is missing")
        const data = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleToken}`
        );
        const info = data.data;
        console.log(info);
        let user = await User.findOne({ email: info.email });
        if (!user) user = await User.create({
            email: info.email,
            firstName: info.given_name,
            lastName: info.family_name
        });
        const token = await generateToken(user);
        response.status(200).json({
            status: "Success",
            data: { user, token }
        });
    } catch (error) {
        console.log(error);
    };
};