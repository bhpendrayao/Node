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
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    console.log(description);
    const product = new Product(title,imageUrl,description,price);
    product.save();
    res.redirect('/');
};
