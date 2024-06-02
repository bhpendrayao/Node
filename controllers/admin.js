const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product',
    });
};


exports.getproducts = (req, res, next) => {
    Product.fetchAll(products=>{
      res.render('admin/products', 
      {
         prods: products, 
        doctitle: 'admin',
         path: '/admin/products',
          pageTitle: 'All Product',
         });
    });
  };

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};
