var express = require('express');
const { loginRequired, canAccessFamily, canAccessWallet } = require('../services/authenticationService');
const { createExpense, getExpenseList, getExpense, updateExpense, deleteExpense, getExpenseReport } = require('../controllers/expenseController');

var router = express.Router();

router.route("/family/expenses/report")
    .post(loginRequired, getExpenseReport);

router.route("/family/:familyId/wallets/:walletId/expenses")
    .get(loginRequired, canAccessFamily, canAccessWallet, getExpenseList)
    .post(loginRequired, canAccessFamily, canAccessWallet, createExpense);

router.route("/family/:familyId/wallets/:walletId/expenses/:expenseId")
    .get(loginRequired, canAccessFamily, canAccessWallet, getExpense)
    .put(loginRequired, canAccessFamily, canAccessWallet, updateExpense)
    .delete(loginRequired, canAccessFamily, canAccessWallet, deleteExpense);

module.exports = router;
