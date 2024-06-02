const express = require('express');
const router = express.Router();
const path = require('path');
const { title } = require('process');
const admincontroller = require('../controllers/admin');

router.get('/add-product',admincontroller.getAddProduct);
router.get('/products',admincontroller.getproducts);
router.post('/add-product',admincontroller.postAddProduct);

module.exports = router; 