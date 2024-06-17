
const express = require('express');
const bodyParser = require('body-parser');
// // const db= require('./util/database');
// const sequelize= require('./util/database');
const app = express();
app.set('view engine', 'ejs');//EJS
app.set('views', 'routes/views');
const User = require('./models/user');
const mongoConnect = require('./util/database').mongoConnect;

const path = require('path');
const adminRoutes = require('./routes/admin')
const shoprequest = require('./routes/shop')

const errorcontroller = require('./controllers/error');
const { name } = require('ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use((req,res,next)=>{
    User.findById('666e8d12d88fd856716281e6').then(user=>{
        req.user= new User(user.name,user.email,user.cart,user._id);
        next();
    }).catch(err=>{
        console.log(err);
    });
});
app.use(express.static(path.join(__dirname,'public')));
app.use('/admin',adminRoutes);
app.use(shoprequest);

app.use(errorcontroller.get404);
// const server=http.createServer(app);
mongoConnect(()=>{

app.listen(3000);
});