const Product = require('../models/product');
const { where } = require('sequelize');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const ITEMS_PER_PAGE=2;

exports.getproduct = (req, res, next) => {
  const page  = +req.query.page || 1;

   let total;
  Product.find().countDocuments()
  .then(numofproducts=>{
    total=numofproducts;
    return  Product.find()
    .skip((page-1)*ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);
  }).then(products =>{
    console.log(products);
    res.render('shop/product-list', 
      {
        prods: products, 
        doctitle: 'product',
        path: '/products',
        pageTitle: 'Product',
        currpage:page,
        hasnextpage:ITEMS_PER_PAGE*page<total,
        haspreviouspage:page>1,
        nextpage:page+1,
        prevpage:page-1,
        lastpage:Math.ceil(total/ITEMS_PER_PAGE)
      });
  }).catch(err=>{
    const error = new Error(err);
    error.httpStatusCode=500;
    return next(error);
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
    const error = new Error(err);
    error.httpStatusCode=500;
    return next(error);
});
 
};


exports.getindex = (req, res, next)=>{
  const page  = +req.query.page || 1;

   let total;
  Product.find().countDocuments()
  .then(numofproducts=>{
    total=numofproducts;
    return  Product.find()
    .skip((page-1)*ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);
  }).then(products =>{
    console.log(products);
    res.render('shop/index', 
      {
        prods: products, 
        doctitle: 'shop',
        path: '/shop',
        pageTitle: 'Shop',
        currpage:page,
        hasnextpage:ITEMS_PER_PAGE*page<total,
        haspreviouspage:page>1,
        nextpage:page+1,
        prevpage:page-1,
        lastpage:Math.ceil(total/ITEMS_PER_PAGE)
      });
  }).catch(err=>{
    const error = new Error(err);
    error.httpStatusCode=500;
    return next(error);
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
      const error = new Error(err);
      error.httpStatusCode=500;
      return next(error);
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
        const error = new Error(err);
        error.httpStatusCode=500;
        return next(error);
    });
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
  }).
  catch(err=>{
    const error = new Error(err);
    error.httpStatusCode=500;
    return next(error);
});
  
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
}).catch(err=>{
  const error = new Error(err);
  error.httpStatusCode=500;
  return next(error);
});
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId).then(order=>{
    if(!order){
      return next(new Error('No Order found.'));
    }
    if(order.user.userId.toString() !== req.user._id.toString()){
          return next(new Error('Unauthorized'));
    }
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);
  

    const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);


    pdfDoc.fontSize(26).text('Invoice',{
      underline:true,
      align:'center'
    });
    pdfDoc.text('--------------------');
    let totalsum=0;
    order.products.forEach(prod=>{
      totalsum  += prod.quantity*prod.product.price;
        pdfDoc.fontSize(14).text(prod.product.title + ' -> ' + prod.quantity + ' X ' + '$' + prod.product.price);
    });
    pdfDoc.text('Total Price:  $'+totalsum);
    pdfDoc.end();
    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   res.setHeader('Content-Type', 'application/pdf');
    //   res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
    //   res.send(data);
    // });   THIS IS READING THE FILE
    // const file=fs.createReadStream(invoicePath);
    // res.setHeader('Content-Type', 'application/pdf');
    //   res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
    //   file.pipe(res); // stream

  }).catch(err=>next(err));
};