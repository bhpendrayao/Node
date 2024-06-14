const Product = require('../models/product');
const Cart =require('../models/cart');
const Order =require('../models/order');
const { where } = require('sequelize');


exports.getproduct = (req, res, next) => {
  Product.findAll().then(products =>{
    res.render('shop/product-list', 
      {
        prods: products, 
        doctitle: 'shop',
        path: '/products',
        pageTitle: 'All Product',
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
 //second way
// Product.findAll({where:{
//   id:prodId
// }}).then(product=>{
//   res.render('shop/product-detail',{product:product[0],pageTitle:product[0].title,path:'/products'});
// }).catch(err=>{console.log(err)});
 // one way
  Product.findByPk(prodId).then(product=>{
      res.render('shop/product-detail',{product:product,pageTitle:product.title,path:'/products'});
  }).catch(err=>{
    console.log(err);
  });
 
};


exports.getindex = (req, res, next)=>{
  Product.findAll().then(products =>{
    res.render('shop/index', 
      {
        prods: products, 
        doctitle: 'shop',
        path: '/shop',
        pageTitle: 'Shop',
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
    req.user.getCart().then(cart=>{
      return  cart.getProducts().then(products=>{
        res.render('shop/cart',{
                path: '/cart',
                pageTitle:'Your Cart',
                products: products
               });
      }).catch(err=>{
        console.log(err);
      });
    }).catch(err=>{
      console.log(err)
    });
  // Cart.getCart(cart =>{
  //   Product.fetchAll(products=>{
  //     const cartProducts =[];
  //     for(product of products){
  //       const cartproduct = cart.products.find(prod =>prod.id === product.id);
  //       if(cartproduct){
  //         cartProducts.push({productData: product, qty:cartproduct.qty})
  //       }
  //     }
  //     // console.log(cartProducts);
  //     res.render('shop/cart',{
  //       path: '/cart',
  //       pageTitle:'Your Cart',
  //       products: cartProducts
  //      });
  //   });
  // });
  
};


exports.postcart = (req, res, next)=>{
  const prodId = req.body.productId;
  let fetchedCart;
  let newquantity=1;
  req.user
  .getCart()
  .then(cart=>{
    fetchedCart=cart;
    return cart.getProducts({where:{id:prodId}});
  }).then(products=>{
  let product;
    if(products.length>0)
      {
        product=products[0];
      }
      if(product)
        {
          //...
          const oldquantity=product.cartItem.quantity;
          newquantity=oldquantity+1;
          return product;
               }
        return Product.findByPk(prodId)
  }).then(product=>{
    return fetchedCart.addProduct(product,
      {through:{quantity:newquantity}
    });
  }).then(()=>{
    res.redirect('/cart');
  })
  .catch(err=>{
    console.log(err);
  })
  // Product.findbyid(prodId,(product)=>{
  //  Cart.addproduct(prodId,product.price)
  // })
  // res.redirect('/cart');  
};

exports.postcartdeleteproduct =(req,res,next)=>{
 const prodId=req.body.productId;
 req.user.getCart()
 .then(cart=>{
  return cart.getProducts({where:{id:prodId}});
 }).then(products=>{
  const product =products[0];
  product.cartItem.destroy();
 }).then(result=>{
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
  req.user.getOrders({include:['products']})
  .then(orders=>{
    res.render('shop/orders',{
      path: '/orders',
      pageTitle:'/shop/orders',
      orders:orders
     })
  })
  .catch(err=>{console.log(err)});
  
};

exports.postOrder=(req,res,next)=>{
  let fetchedCart;
  req.user.getCart().then(cart=>{
    fetchedCart=cart;
    return cart.getProducts();
  }).then(products => {
    return req.user.createOrder().then(order=>{
     return order.addProducts(products.map(product=>{
        product.orderItem = {quantity:product.cartItem.quantity};
        return product;
      }));
    }).then(reult=>{
      fetchedCart.setProducts(null);
      
    }).then(result=>{
      res.redirect('/orders');
    }).catch(err=>{console.log(err)});
  }).catch(err=>{
    console.log(err);
  })
};