const express = require('express');

const {check,body } = require('express-validator');
const router = express.Router();
const path = require('path');
const { title } = require('process');
const admincontroller = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

router.get('/add-product',isAuth,admincontroller.getAddProduct);
router.get('/products',  
isAuth,admincontroller.getproducts);
router.post('/add-product',
    body('title','Invalid title')
    .isString()
    .isLength({min:3})
    .trim(),
    body('price','Invalid Price upto 2 Decimal place')
    .isFloat(),
    body('description','Invalid Description min % words Max 200')
    .isLength({min:5,max:200})
    .trim(), isAuth,admincontroller.postAddProduct);
router.post('/edit-product',
    body('title','Invalid title')
    .isString()
    .isLength({min:3})
    .trim(),
    body('price','Invalid Price upto 2 Decimal place')
    .isFloat(),
    body('description','Invalid Description min % words Max 200')
    .isLength({min:5,max:200})
    .trim(),
    isAuth,admincontroller.postEditProduct);
router.get('/edit-product/:productId',isAuth,admincontroller.getEditProduct);
router.delete('/product/:productId',isAuth,admincontroller.deleteProduct);


module.exports = router; 