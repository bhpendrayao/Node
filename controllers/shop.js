const Product = require('../models/product');
const Cart =require('../models/cart');
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
  Cart.getCart(cart =>{
    Product.fetchAll(products=>{
      const cartProducts =[];
      for(product of products){
        const cartproduct = cart.products.find(prod =>prod.id === product.id);
        if(cartproduct){
          cartProducts.push({productData: product, qty:cartproduct.qty})
        }
      }
      // console.log(cartProducts);
      res.render('shop/cart',{
        path: '/cart',
        pageTitle:'Your Cart',
        products: cartProducts
       });
    });
  });
  
};


exports.postcart = (req, res, next)=>{
  const prodId = req.body.productId;
  Product.findbyid(prodId,(product)=>{
   Cart.addproduct(prodId,product.price)
  })
  res.redirect('/cart');  
};

exports.postcartdeleteproduct =(req,res,next)=>{
 console.log(req.body);
 const prodId=req.body.productId;
 Product.findbyid(prodId,product=>{
   Cart.deleteproduct(prodId, product.price);
   res.redirect('/cart');
 });
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