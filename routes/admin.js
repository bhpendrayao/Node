const express = require('express');
const router = express.Router();
const path = require('path');
const { title } = require('process');
const productcontroller = require('../controllers/products');

router.get('/add-product',productcontroller.getAddProduct);
router.post('/add-product',productcontroller.postAddProduct);

exports.routes = router;
exports.product = product; 