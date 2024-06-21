const User = require('../models/user');
exports.getLogin = (req, res, next)=>{
  // const loggedIn=req.get('Cookie').split('=')[1]==='true';
res.render('auth/login',{
        path: '/login',
        pageTitle:'Login Page',
        isAuthenticated: false
       });
    
  };

  exports.postLogin = (req, res, next)=>{
       // res.setHeader('Set-Cookie','loggedIn=true;HttpOnly');
       User.findById('6672daa9e22d3fac9a1b8ff1').then(user=>{
         req.session.isLoggedIn = true;
         req.session.user = user;
         req.session.save(err=>{
          res.redirect('/');
         });
       }).catch(err=>{
         console.log(err);
       });
    };
exports.postLogout = (req, res, next)=>{
            // res.setHeader('Set-Cookie','loggedIn=true;HttpOnly');
            req.session.destroy(()=>{
               res.redirect('/');
            });
               };
          