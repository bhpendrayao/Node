const { ValidationError } = require('sequelize');
const Product = require('../models/product');
const fileHelper = require('../util/file');
const {validationResult}=require('express-validator');
const { promiseImpl } = require('ejs');
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product',
        editing: false,
        hasError:false,
        errorMessage:null,
        validationErrors:[]
    });
};


exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    if(!image){
        console.log('image');
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add product',
            path: '/admin/add-product',
            editing: false,
            hasError:true,
            product:{
                title:title,
                price:price,
                description:description
            },
            errorMessage:'Attached file is not an image',
            validationErrors:[]
        });
    }
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
       return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add product',
            path: '/admin/add-product',
            editing: false,
            hasError:true,
            product:{
                title:title,
                price:price,
                imageurl:imageurl,
                description:description
            },
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()
        });
    }
    const imageurl=image.path;
    console.log(imageurl);
    const product = new Product({
        title:title,
        imageurl:imageurl,
        description:description,
        price:price,
        userId:req.user
    });
    product.save()
    .then(result =>{
        console.log(result);
        res.redirect('/admin/products');
    }).catch(err=>{
        // return res.status(500).render('admin/edit-product', {
        //     pageTitle: 'Add product',
        //     path: '/admin/add-product',
        //     editing: false,
        //     hasError:true,
        //     product:{
        //         title:title,
        //         imageurl:imageurl,
        //         price:price,
        //         description:description
        //     },
        //     errorMessage:'Database Operation Failed , Please Try Again',
        //     validationErrors:errors.array()
        // });
        const error = new Error(err);
      error.httpStatusCode=500;
      console.log('error hai');
       return next(error);
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
        const error = new Error(err);
        error.httpStatusCode=500;
        return next(error);
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
                    return res.redirect('/');
                }
                console.log("editted");
                console.log(product);
            res.render('admin/edit-product', {
                pageTitle: 'Edit product',
                path: '/admin/edit-product',
                editing: editMode,
                product:product,
                hasError:false,
                errorMessage:null,
                validationErrors:[]
            });
        }
    ).catch(err=>{
        console.log('yaha bsdk');
        const error = new Error(err);
        error.httpStatusCode=500;
        return next(error);
    });
     
};

exports.postEditProduct =(req, res, next) =>{
    const updateid =req.body.productId
    const updatetitle = req.body.title;
    const image = req.file;
    const updateprice = req.body.price;
    const updatedescription = req.body.description;
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
       return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit product',
            path: '/admin/edit-product',
            editing: true,
            hasError:true,
            product:{
                title:updatetitle,
                price:updateprice,
               description:updatedescription,
               _id:updateid
            },
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()
        });
    }
    Product.findByIdAndUpdate(updateid).then(product=>{
        if(product.userId.toString() !== req.user._id.toString())
            {
                return res.redirect('/');
            }
        product.title=updatetitle;
        if(image)
            {
             fileHelper.deleteFile(product.imageurl);
             product.imageurl=image.path;   
            }
        product.description=updatedescription;
        product.price=updateprice;
        return product.save().then(result =>{
            console.log(result);
            console.log('UPDATED');
            res.redirect('/admin/products');
            });
    })
    .catch(err=>{
      const error = new Error(err);
      error.httpStatusCode=500;
      return next(error);
    });
};


exports.postDeleteProduct = (req,res,next) =>{
    const updateid =req.body.productId
    Product.findById(updateid).then(producr=>{
            if(!producr)
            {
                return next(new Error('Product not Found'));
            }
            fileHelper.deleteFile(producr.imageurl);
            
            return Product.deleteOne({_id:updateid,userId:req.user._id});
    })
    .then(result =>{
        console.log("DELETED RESULT");
        res.redirect('/admin/products');
    }).catch(err=>{
        console.log('yahahaa huu');
        const error = new Error(err);
        error.httpStatusCode=500;
        return next(error);
    });
};
