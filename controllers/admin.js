const { where } = require('sequelize');
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
    Product.findAll().then(products =>{
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
    req.user.getProducts({where: {id:prodId}})
    // Product.findByPk(prodId)
    .then(
        products =>{
            const product = products[0];
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
        }
    ).catch(err=>{console.log(err)});
     
};

exports.postEditProduct =(req, res, next) =>{
    console.log(req.body.productId);
    const updateid =req.body.productId
    const updatetitle = req.body.title;
    const updateimageurl = req.body.imageUrl;
    const updateprice = req.body.price;
    const updatedescription = req.body.description;
    // const updatedproduct = new Product(updateid,updatetitle,updateimageurl,updatedescription,updateprice);
    // updatedproduct.save();
    Product.findByPk(updateid).then(product=>{
        product.title=updatetitle;
        product.imageurl=updateimageurl;
        product.price=updateprice;
        product.description=updatedescription;
        return product.save();

    }).then(result =>{
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
    req.user.createProduct({
        title:title,
        description:description,
        price:price,
        imageurl:imageurl
    })
    // const product = new Product(null,title,imageUrl,description,price);
    // product.save().then(()=>{res.redirect('/');}).catch(err =>{console.log(err);});
    //Product.create() for single
    .then(result =>{
        //console.log(result);
        console.log('created product');
        res.redirect('/admin/products');
    }).catch(err=>{
        console.log(err);
    });
    
};

exports.postDeleteProduct = (req,res,next) =>{
    const updateid =req.body.productId
    Product.findByPk(updateid).then(product=>{
        return product.destroy();
    }).then(result =>{
        console.log("DELETED RESULT");
        res.redirect('/admin/products');
    }).catch(err =>{
        console.log(err);
    });
};
