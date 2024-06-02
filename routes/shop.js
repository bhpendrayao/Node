const express = require('express');
const router = express.Router();
const path = require('path');
const adminData = require('./admin');
const shopcontroller = require('../controllers/shop')
router.get('/',shopcontroller.getindex); 

router.get('/products',shopcontroller.getproduct);

router.get('/cart',shopcontroller.getcart);

router.get('/checkout',shopcontroller.getcheckout)

module.exports = router;