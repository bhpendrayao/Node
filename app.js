
const express = require('express');
const bodyParser = require('body-parser');
const MONGODB_URI= 'mongodb+srv://bt21ece027:6GkU3Xb0PkMun5yB@cluster0.bsclqpp.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0app.listen(3000)';
const app = express();
const mongoose = require('mongoose');
app.set('view engine', 'ejs');//EJS
app.set('views', 'routes/views');
const User = require('./models/user');
const session = require('express-session');
const csrf=require('csurf');
const flash=require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri:MONGODB_URI,
    collection:'sessions'
    //expire
});

const csrfProtection = csrf();

const path = require('path');
const adminRoutes = require('./routes/admin')
const shoprequest = require('./routes/shop')
const authRoutes = require('./routes/auth')

const errorcontroller = require('./controllers/error');
const { name } = require('ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret:'my secret', resave:false,saveUninitialized:false,store:store}));//session initialzation 

app.use(csrfProtection);
app.use(flash());

app.use((req,res,next)=>{
    if(!req.session.user)
     {
            return next();
     }
    User.findById(req.session.user._id).then(user=>{
        req.user=user
        next();
    }).catch(err=>{
        console.log(err);
    });
});

app.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn;
    res.locals.csrfToken=req.csrfToken();
    next();
});

app.use(express.static(path.join(__dirname,'public')));
app.use('/admin',adminRoutes);
app.use(shoprequest);
app.use(authRoutes);
app.use(errorcontroller.get404);
// const server=http.createServer(app);
mongoose.connect(
MONGODB_URI
).then(result=>{ 
    console.log("Connected!!");
    app.listen(3000);
}).catch(err=>{ 
    console.log(err);
});