var express = require('express');
const { createCategory, getCategoryList } = require('../controllers/categoryController');
var router = express.Router();

router.route("/categories").get(getCategoryList).post(createCategory);

module.exports = router;
