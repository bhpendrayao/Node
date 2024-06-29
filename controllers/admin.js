const Product = require('../models/product');
exports.getAddProduct = (req, res, next) => {
    
    res.render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product',
        editing: false,
    });
};


exports.getproducts = (req, res, next) => {
    //sequelize
    Product.find({userId:req.user._id})
    // .select('title price -_id')
    // .populate('userId','name')
    .then(products =>{
        res.render('admin/products', 
            {
               prods: products, 
              doctitle: 'admin',
               path: '/admin/products',
                pageTitle: 'Admin Product'
               });
      }).catch(err=>{
        console.log(err);
      });
  };

  exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
     if(!editMode)
        {
            return res.redirect('/');
        }
    const prodId = req.params.productId;
    Product.findById(prodId)
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
                product:product,
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
    Product.findByIdAndUpdate(updateid).then(product=>{
        product.title=updatetitle;
        product.imageurl=updateimageurl;
        product.description=updatedescription;
        product.price=updateprice;
        return product.save();
    }).then(result =>{
        console.log(result);
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
    const product = new Product({
        title:title,
        imageurl:imageurl,
        description:description,
        price:price,
        userId:req.user
    })
        .save()
    .then(result =>{
        console.log('created product');
        res.redirect('/admin/products');
    }).catch(err=>{
        console.log(err);
    });
    
};

exports.postDeleteProduct = (req,res,next) =>{
    const updateid =req.body.productId
    Product.findByIdAndDelete(updateid).then(result =>{
        console.log("DELETED RESULT");
        res.redirect('/admin/products');
    }).catch(err =>{
        console.log(err);
    });
};
