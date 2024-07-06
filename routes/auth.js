const express = require('express');
const User = require('../models/user');

const {check,body } = require('express-validator');

const router = express.Router();
const authcontroller = require('../controllers/auth');
router.get('/login',authcontroller.getLogin);
router.post('/login',body('email').isEmail().withMessage('Please Enter a Valid Email').normalizeEmail(),
   body('password',
    'Please enter a password with only numbers and text and at least 5 character'
    )
   .isLength({min:5})
   .isAlphanumeric().trim(),authcontroller.postLogin);
router.post('/logout',authcontroller.postLogout);
router.get('/signup',authcontroller.getSignup);
router.post('/signup',
        check('email')
        .isEmail()
        .withMessage('Please enter a valid Email Address.').custom((value, {req})=>{
            // if(value==='test@gmail.com'){
            //     throw new Error('This email address is forbidden');
            // }
            // return true; 
            return User.findOne({email:value}).then(userDoc=>{
                if(userDoc){
                    return Promise.reject('E-mail Exists Already ,Please Use Another Email');
                }
           });}).normalizeEmail(),
       body('password',
           'Please enter a password with only numbers and text and at least 5 character'
         )
        .isLength({min:5})
        .isAlphanumeric().trim(),
       body('confirmPassword',
               'Confirm Password doesn`t matches with Password'
        )
        .custom((value, {req})=>{
           if(value!==req.body.password){
            throw new Error('Passwords have  to match !!');
            }
            return true; 
         }).trim(),authcontroller.postSignup
);
router.get('/reset',authcontroller.getReset);
router.post('/reset',authcontroller.postReset);
router.get('/reset/:token',authcontroller.getNewPassword);
router.post('/new-password',authcontroller.postNewPassword);
module.exports=router;