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

exports.getproductdetail = (req, res, next) => {
 const prodId = req.params.productId;
  Product.findbyid(prodId,product=>{
  if(product);
  {
    res.render('shop/product-detail',{product:product,pageTitle:product.title,path:'/products'});
  }
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

exports.postcart = (req, res, next)=>{
  const prodId = req.body.productId;
  console.log(prodId);
  res.redirect('/cart');
};

exports.getcheckout = (req, res, next)=>{
  res.render('shop/checkout',{
   path: '/checkout',
   pageTitle:'/shop/checkout'
  })
};

exports.getorder = (req, res, next)=>{
  res.render('shop/orders',{
   path: '/orders',
   pageTitle:'/shop/orders'
  })
};