var express = require('express');
const { getUsersList, createUser, logIn, logOut, updateMyProfile, getMyProfile, logInWithFacebook, logInWithGoogle } = require('../controllers/userController');
const { loginRequired, canAccessPersonalWallet } = require('../services/authenticationService');
const { createPersonalWallet, updatePersonalWallet, deletePersonalWallet, getPersonalWalletList, getPersonalWallet } = require('../controllers/walletController');
var router = express.Router();

router.route("/users").get(getUsersList).post(createUser);

router.route("/users/me").get(loginRequired, getMyProfile)
    .put(loginRequired, updateMyProfile);

router.route("/me/wallets").get(loginRequired, getPersonalWalletList)
    .post(loginRequired, createPersonalWallet);

router.route("/me/wallets/:walletId").get(loginRequired, canAccessPersonalWallet, getPersonalWallet)
    .put(loginRequired, canAccessPersonalWallet, updatePersonalWallet)
    .delete(loginRequired, canAccessPersonalWallet, deletePersonalWallet);


router.route("/auth/login").post(logIn);

router.route("/auth/login/facebook").post(logInWithFacebook);

router.route("/auth/login/google").post(logInWithGoogle);

router.route("/auth/logout").post(loginRequired, logOut);

module.exports = router;
