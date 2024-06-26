const Product = require('../models/product');
const { where } = require('sequelize');
const Order = require('../models/order');

exports.getproduct = (req, res, next) => {
  Product.find().then(products =>{
    console.log(products);
    res.render('shop/product-list', 
      {
        prods: products, 
        doctitle: 'shop',
        path: '/products',
        pageTitle: 'All Product'
      });
  }).catch(err=>{
    console.log(err);
  });
  //SQL 
  // Product.fetchAll().then(([rows, fieldData])=>{
  //   res.render('shop/product-list', 
  //     {
  //        prods: rows, 
  //       doctitle: 'shop',
  //        path: '/products',
  //         pageTitle: 'All Product',
  //        });
  // })
  // .catch(err=>{console.log(err);});
};

exports.getproductdetail = (req, res, next) => {
 const prodId = req.params.productId;
  Product.findById(prodId).then(product=>{
      res.render('shop/product-detail',{product:product,pageTitle:product.title,path:'/products-detail'});
  }).catch(err=>{
    console.log(err);
  });
 
};


exports.getindex = (req, res, next)=>{
  Product.find().then(products =>{
    console.log(products);
    res.render('shop/index', 
      {
        prods: products, 
        doctitle: 'shop',
        path: '/shop',
        pageTitle: 'Shop'
      });
  }).catch(err=>{
    console.log(err);
  });
  // USED IN MYSQL
  // Product.fetchAll().then(([rows, fieldData])=>{
  //   res.render('shop/index', 
  //     {
  //       prods: rows, 
  //       doctitle: 'shop',
  //       path: '/shop',
  //       pageTitle: 'Shop',
  //     });
  // }).catch(err =>{
  //   console.log(err);
  // });

};

exports.getcart = (req, res, next)=>{
    req.user
    .populate('cart.items.productId')
    .then(user=>{
      const products = user.cart.items;
      const newProducts=[];
      for (const product of products) {
        if(product.productId!==null && product.productId !== undefined){
            const newProduct = {
              productId: product.productId,
              quantity: product.quantity
            };
            newProducts.push(newProduct);
            console.log(newProduct);
          }
      }
      console.log('Detail tha yeh');
        res.render('shop/cart',{
                path: '/cart',
                pageTitle:'Your Cart',
                products: newProducts,
               });
    }).catch(err=>{
      console.log(err)
    });
};


exports.postcart = (req, res, next)=>{
  const prodId = req.body.productId;
  console.log(prodId);
  Product.findById(prodId).then(product =>{
    console.log("post krne ke phele ki Id");
    return req.user.addToCart(product);
  }).then(result=>{console.log(result)
    console.log("Redirect Chutiya hai");
    res.redirect('/');
  });
};

exports.postcartdeleteproduct =(req,res,next)=>{
 const prodId=req.body.productId;
 console.log('jisko delete krna hai uski id')
 console.log(prodId);
 req.user.deleteitemfromcart(prodId)
 .then(result=>{
   res.redirect('/cart');
 })
 .catch(err=>{
  console.log(err);
 })
//  Product.findbyid(prodId,product=>{
//    Cart.deleteproduct(prodId, product.price);
//    res.redirect('/cart');
//  });
};


exports.getorder = (req, res, next)=>{
  Order.find({'user.userId':req.user._id})
  .then(orders=>{
    res.render('shop/orders',{
      path: '/orders',
      pageTitle:'/shop/orders',
      orders:orders,
     })
  })
  .catch(err=>{console.log(err)});
  
};

exports.postOrder=(req,res,next)=>{
  req.user
    .populate('cart.items.productId')
    .then(user=>{
      const products = user.cart.items.map(i=>{
        return {quantity:i.quantity,product:{...i.productId._doc}}//spread operator
      });
      const order = new Order({
        user:{
          email:req.user.email,
          userId: req.user
        },
        products:products
        });
        return order.save();
    })
 .then(result=>{
      req.user.clearCart();
      
    }).then(()=>{
      res.redirect('/orders');
}).catch(err=>{console.log(err)});
};