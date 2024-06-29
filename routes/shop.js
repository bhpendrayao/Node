const express = require('express');
const router = express.Router();
const path = require('path');
const adminData = require('./admin');
const shopcontroller = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

router.get('/',shopcontroller.getindex); 

router.get('/products',shopcontroller.getproduct);

router.get('/products/:productId',shopcontroller.getproductdetail);

 router.get('/cart',isAuth,shopcontroller.getcart);

 router.post('/cart',isAuth,shopcontroller.postcart);

 router.post('/deleteitem',isAuth,shopcontroller.postcartdeleteproduct);


  router.post('/create-order',isAuth,shopcontroller.postOrder);

router.get('/orders',isAuth,shopcontroller.getorder);

module.exports = router;