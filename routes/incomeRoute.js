var express = require('express');
const { loginRequired, canAccessFamily, canAccessWallet } = require('../services/authenticationService');
const { createIncome, updateIncome, deleteIncome, getIncomeList, getIncome } = require('../controllers/incomeController');

var router = express.Router();

router.route("/family/:familyId/wallets/:walletId/incomes")
    .get(loginRequired, canAccessFamily, canAccessWallet, getIncomeList)
    .post(loginRequired, canAccessFamily, canAccessWallet, createIncome);

router.route("/family/wallets/:walletId/incomes/:incomeId")
    .get(loginRequired, canAccessFamily, canAccessWallet, getIncome)
    .put(loginRequired, canAccessFamily, canAccessWallet, updateIncome)
    .delete(loginRequired, canAccessFamily, canAccessWallet, deleteIncome);

module.exports = router;
