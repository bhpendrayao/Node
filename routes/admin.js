const express = require('express');
const router = express.Router();
const path = require('path');
const { title } = require('process');
const admincontroller = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

router.get('/add-product',isAuth,admincontroller.getAddProduct);
router.get('/products',isAuth,admincontroller.getproducts);
router.post('/add-product',isAuth,admincontroller.postAddProduct);
router.post('/edit-product',isAuth,admincontroller.postEditProduct);
router.get('/edit-product/:productId',isAuth,admincontroller.getEditProduct);
router.post('/delete-product',isAuth,admincontroller.postDeleteProduct);


module.exports = router; 