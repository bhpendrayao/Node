const crypto =require('crypto');

const User = require('../models/user');
const nodemailer=require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const auth = {
  auth: {
    api_key: '1e4bd46f6deb10127b70238a1eaaf348-fe9cf0a8-4d242e5c',
    domain:' sandboxe7e63551889746d29b50f361fa5ab828.mailgun.org'
  }
}

const transporter = nodemailer.createTransport(mg(auth));
const bcrypt = require('bcryptjs');
exports.getLogin = (req, res, next)=>{
  // const loggedIn=req.get('Cookie').split('=')[1]==='true';
  let message = req.flash('error');
  if(message.length>0)
    {
      message =message[0];
    }else{
      message=null;
    }
res.render('auth/login',{
        path: '/login',
        pageTitle:'Login Page',
        errorMessage:message
       });
    
  };

exports.getSignup = (req, res, next)=>{
  let message = req.flash('error');
  if(message.length>0)
    {
      message =message[0];
    }else{
      message=null;
    }
  res.render('auth/signup',{
          path: '/signup',
          pageTitle:'SignUp Page',
          errorMessage:message
         });
      
    };
exports.postSignup = (req, res, next)=>{
  const email=req.body.email;
  const password = req.body.password;
  const confirmPassword=req.body.confirmPassword;
  User.findOne({email:email}).then(userDoc=>{
    if(userDoc){
      req.flash('error','E-mail Already in use');
      return res.redirect('/signup');
    }
    return bcrypt
    .hash(password,12)
    .then(hashedPassword=>{
      const user = new User({
        email: email,
        password: hashedPassword,
        cart:{items:[]}
      });
      return user.save();
    }).then(result=>{
      res.redirect('/login');
      return transporter.sendMail({
        to:email.toString(),
        from:'bhupendratiwari2002@gmail.com',
        subject: 'Hey you, awesome!',
        html: '<b>Wow second try</b>'
      });
    }).catch(err=>{
      console.log("mail ka error");
      console.log(err);
    })
  }).catch(err=>{
    console.log(err);
  });
};

  exports.postLogin = (req, res, next)=>{
       // res.setHeader('Set-Cookie','loggedIn=true;HttpOnly');
       const email=req.body.email;
       const password=req.body.password;
       User.findOne({email:email})
       .then(user=>{
        if(!user){
          req.flash('error','Invalid email.');
          return res.redirect('/login');
        }
        bcrypt.compare(password,user.password).then(domatch=>{
          if(domatch){
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err=>{
               res.redirect('/');
            });
          }
          req.flash('error','Invalid Password.');
          return res.redirect('/login');
        }).catch(err=>{
          console.log(err);
          res.redirect('/login');
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
exports.getReset=(req,res,next)=>{
  let message = req.flash('error');
  if(message.length>0)
    {
      message =message[0];
    }else{
      message=null;
    }
  res.render('auth/reset',{
    path: '/reset',
    pageTitle:'Reset Password',
    errorMessage:message
   });
};
exports.postReset=(req,res,next)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({email:req.body.email}).then(user=>{
      if(!user)
        {
          req.flash('error','No Account with that email found');
          return res.redirect('/reset');
        }
        user.resetToken=token;
        user.resetTokenExpiration=Date.now()+360000;
       return user.save();
    }).then(
      result=>{
        res.redirect('/');
        transporter.sendMail({
          to:req.body.email.toString(),
          from:'bhupendratiwari2002@gmail.com',
          subject: 'Password reset',
          html: `
          <p>You Requested For Password Reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a>  to set a New Password</p>
          `
        });
      }
    ).catch(err=>{
      console.log(err);
    });
  });
};

exports.getNewPassword=(req,res,next)=>{
  const token = req.params.token;
  User.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}}).then(user=>{
    let message = req.flash('error');
  if(message.length>0)
    {
      message =message[0];
    }else{
      message=null;
    }
    res.render('auth/new-password',{
      path: '/new-password',
    pageTitle:'Update Password',
    errorMessage:message,
    userId:user._id.toString(),
    passwordToken:token
    });

  }).catch(err=>{
    console.log(err);
  });
  
};

exports.postNewPassword=(req,res,next)=>{
  const newpassword=req.body.password;
  const userId=req.body.userId;
  const passwordToken=req.body.passwordToken;
  let resetUser;
  User.findOne({resetToken:passwordToken,resetTokenExpiration:{$gt:Date.now()},_id:userId  })
  .then(user=>{
    resetUser=user;
    return bcrypt.hash(newpassword,12);
  }).then(hashedPassword=>{
    resetUser.password=hashedPassword;
    resetUser.resetToken=null;
    resetUser.resetTokenExpiration=undefined;
   return resetUser.save();
  }).then(result=>{
    res.redirect('/login');
  })
  .catch(err=>{
    console.log(err);
  });
};