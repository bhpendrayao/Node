const product =[];

exports.getAddProduct=(req,res,next)=>{
    res.render('add-product',{
        prods: product,
        pageTitle:'Add product',
        path:'/admin/add-product',
        productCSS: true,
        activeaddproduct: true
    });
};

exports.postAddProduct=(req,res,next)=>{
    product.push({title: req.body.title});;
    res.redirect('/');
};