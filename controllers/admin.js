const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product',
        editing: false
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

  exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
     if(!editMode)
        {
            return res.redirect('/');
        }
    const prodId = req.params.productId;
    Product.findbyid(prodId, product =>{
        if(!product)
            {
                return redirect('/');
            }
        res.render('admin/edit-product', {
            pageTitle: 'Add product',
            path: '/admin/edit-product',
            editing: editMode,
            product:product
        });
    });
     
};

exports.postEditProduct =(req, res, next) =>{
    console.log(req.body.productId);
    const updateid =req.body.productId
    const updatetitle = req.body.title;
    const updateimageurl = req.body.imageurl;
    const updateprice = req.body.price;
    const updatedescription = req.body.description;
    const updatedproduct = new Product(updateid,updatetitle,updateimageurl,updatedescription,updateprice);
    updatedproduct.save();
    res.redirect('/admin/products')
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null,title,imageUrl,description,price);
    product.save().then(()=>{res.redirect('/');}).catch(err =>{console.log(err);});
    
};

exports.postDeleteProduct = (req,res,next) =>{
    const updateid =req.body.productId
    Product.deletebyid(updateid);
    res.redirect('/admin/products');
};
