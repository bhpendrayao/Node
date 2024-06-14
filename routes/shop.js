const express = require('express');
const router = express.Router();
const path = require('path');
const adminData = require('./admin');
const shopcontroller = require('../controllers/shop')
router.get('/',shopcontroller.getindex); 

router.get('/products',shopcontroller.getproduct);

router.get('/products/:productId',shopcontroller.getproductdetail);

router.get('/cart',shopcontroller.getcart);

router.post('/cart',shopcontroller.postcart);

router.post('/deleteitem',shopcontroller.postcartdeleteproduct);


router.post('/create-order',shopcontroller.postOrder);

router.get('/orders',shopcontroller.getorder)


module.exports = router;