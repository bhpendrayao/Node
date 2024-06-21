
exports.getLogin = (req, res, next)=>{
   const loggedIn=req.get('Cookie').split('=')[1]==='true';
res.render('auth/login',{
        path: '/login',
        pageTitle:'Login Page',
        isAuthenticated: loggedIn
       });
    
  };

  exports.postLogin = (req, res, next)=>{
        res.setHeader('Set-Cookie','loggedIn=true;HttpOnly');
        res.redirect('/');
          };