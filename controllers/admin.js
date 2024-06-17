const Product = require('../models/product');
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product',
        editing: false
    });
};


exports.getproducts = (req, res, next) => {
    //sequelize
    Product.fetchAll().then(products =>{
        res.render('admin/products', 
            {
               prods: products, 
              doctitle: 'admin',
               path: '/admin/products',
                pageTitle: 'All Product',
               });
      }).catch(err=>{
        console.log(err);
      });
      //SQL
    // Product.fetchAll(products=>{
    //   res.render('admin/products', 
    //   {
    //      prods: products, 
    //     doctitle: 'admin',
    //      path: '/admin/products',
    //       pageTitle: 'All Product',
    //      });
    // });
  };

  exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
     if(!editMode)
        {
            return res.redirect('/');
        }
    const prodId = req.params.productId;
    Product.findByPk(prodId)
    // Product.findByPk(prodId)
    .then(
        product =>{
            if(!product)
                {
                    return redirect('/');
                }
                console.log("editted");
                console.log(product);
            res.render('admin/edit-product', {
                pageTitle: 'Add product',
                path: '/admin/edit-product',
                editing: editMode,
                product:product
            });
        }
    ).catch(err=>{console.log(err)});
     
};

exports.postEditProduct =(req, res, next) =>{
    const updateid =req.body.productId
    const updatetitle = req.body.title;
    const updateimageurl = req.body.imageUrl;
    const updateprice = req.body.price;
    const updatedescription = req.body.description;
    // const updatedproduct = new Product(updateid,updatetitle,updateimageurl,updatedescription,updateprice);
    // updatedproduct.save();
        const product = new Product(updatetitle,updateimageurl,updatedescription,updateprice,req.user._id,updateid);
     product.save().then(result =>{
        console.log('UPDATED');
        res.redirect('/admin/products');
        })
    .catch(err=>{console.log(err)});
    
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageurl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title,imageurl,description,price,req.user._id,null).save()
    // product.save().then(()=>{res.redirect('/');}).catch(err =>{console.log(err);});
    //Product.create() for single
    .then(result =>{
        console.log('created product');
        res.redirect('/admin/products');
    }).catch(err=>{
        console.log(err);
    });
    
};

exports.postDeleteProduct = (req,res,next) =>{
    const updateid =req.body.productId
    Product.deletebyid(updateid).then(result =>{
        console.log("DELETED RESULT");
        res.redirect('/admin/products');
    }).catch(err =>{
        console.log(err);
    });
};
