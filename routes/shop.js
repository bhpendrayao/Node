const express = require('express');
const router = express.Router();
const path = require('path');
const adminData = require('./admin');

router.get('/',(req,res,next)=>{
  // console.log('shop.js',adminData.product)
  //   res.sendFile(path.join(__dirname,'../','routes','views','shop.html'));
  const product = adminData.product;
  res.render('shop',{prods: product,doctitle:'shop',path:'/shop',pageTitle:'Shop', hasproduct: product.length>0,activeshop: true,productCSS: true});
  }); 

module.exports = router;