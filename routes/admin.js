const express = require('express');
const router = express.Router();
const path = require('path');
const { title } = require('process');

const product=[];
router.get('/add-product',(req,res,next)=>{
    // res.sendFile(path.join(__dirname,'../','routes','views','add-product.html'));
    res.render('add-product',{prods: product,pageTitle:'Add product',path:'/admin/add-product',productCSS: true,activeaddproduct: true});
});
router.post('/add-product',(req,res,next)=>{
    product.push({title: req.body.title});;
    res.redirect('/');
  });

exports.routes = router;
exports.product = product; 