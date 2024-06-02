const Product = require('../models/product');

exports.getproduct = (req, res, next) => {
  Product.fetchAll(products=>{
    res.render('shop/product-list', 
    {
       prods: products, 
      doctitle: 'shop',
       path: '/products',
        pageTitle: 'All Product',
       });
  });
};

exports.getindex = (req, res, next)=>{
  Product.fetchAll(products=>{
    res.render('shop/index', 
    {
       prods: products, 
      doctitle: 'shop',
       path: '/shop',
        pageTitle: 'Shop',
       });
  });
};

exports.getcart = (req, res, next)=>{
  res.render('shop/cart',{
   path: '/cart',
   pageTitle:'Your Cart'
  })
};
exports.getcheckout = (req, res, next)=>{
  res.render('shop/checkout',{
   path: '/checkout',
   pageTitle:'/shop/checkout'
  })
};