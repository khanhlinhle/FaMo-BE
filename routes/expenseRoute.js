var express = require('express');
const { loginRequired, canAccessFamily, canAccessWallet } = require('../services/authenticationService');
const { createExpense, getExpenseList, getExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');

var router = express.Router();

router.route("/family/wallets/:walletId/expenses")
    .get(loginRequired, canAccessFamily, canAccessWallet, getExpenseList)
    .post(loginRequired, canAccessFamily, canAccessWallet, createExpense);

router.route("/family/wallets/:walletId/expenses/:expenseId")
    .get(loginRequired, canAccessFamily, canAccessWallet, getExpense)
    .put(loginRequired, canAccessFamily, canAccessWallet, updateExpense)
    .delete(loginRequired, canAccessFamily, canAccessWallet, deleteExpense);

module.exports = router;
