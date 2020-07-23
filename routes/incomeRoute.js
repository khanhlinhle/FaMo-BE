var express = require('express');
const { loginRequired, canAccessFamily, canAccessWallet } = require('../services/authenticationService');
const { createIncome, updateIncome, deleteIncome, getIncomeList, getIncome, getIncomeReport } = require('../controllers/incomeController');

var router = express.Router();

router.route("/family/incomes/report")
    .post(loginRequired, getIncomeReport);

router.route("/family/:familyId/wallets/:walletId/incomes")
    .get(loginRequired, canAccessFamily, canAccessWallet, getIncomeList)
    .post(loginRequired, canAccessFamily, canAccessWallet, createIncome);

router.route("/family/:familyId/wallets/:walletId/incomes/:incomeId")
    .get(loginRequired, canAccessFamily, canAccessWallet, getIncome)
    .put(loginRequired, canAccessFamily, canAccessWallet, updateIncome)
    .delete(loginRequired, canAccessFamily, canAccessWallet, deleteIncome);

module.exports = router;
