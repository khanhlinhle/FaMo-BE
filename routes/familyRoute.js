var express = require('express');
const { loginRequired, canAccessFamily, canAccessWallet } = require('../services/authenticationService');
const { createFamily, addFamilyMember, removeFamilyMember, addFamilyWallet, removeFamilyWallet, getFamily } = require('../controllers/familyController');
const { createWallet, updateWallet, deleteWallet, getWalletList, getWallet } = require('../controllers/walletController');
var router = express.Router();

router.route("/family").get(loginRequired, getFamily)
    .post(loginRequired, createFamily)
    .put(loginRequired, addFamilyMember)
    .put(loginRequired, removeFamilyMember)
    .put(loginRequired, addFamilyWallet)
    .put(loginRequired, removeFamilyWallet);

router.route("/family/wallets").get(loginRequired, canAccessFamily, getWalletList)
    .post(loginRequired, canAccessFamily, createWallet);

router.route("/family/wallets/:walletId").get(loginRequired, canAccessFamily, canAccessWallet, getWallet)
    .post(loginRequired, canAccessFamily, canAccessWallet, updateWallet)
    .delete(loginRequired, canAccessFamily, canAccessWallet, deleteWallet);

module.exports = router;
