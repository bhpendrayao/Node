
const express = require('express');
const bodyParser = require('body-parser');
// const db= require('./util/database');
const sequelize= require('./util/database');
const app = express();
app.set('view engine', 'ejs');//EJS
app.set('views', 'routes/views');

const path = require('path');
const adminRoutes = require('./routes/admin')
const shoprequest = require('./routes/shop')
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const errorcontroller = require('./controllers/error');
const { name } = require('ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use((req,res,next)=>{
    User.findByPk(1).then(user=>{
        req.user=user;
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


//ONE-->TO-->MANY
Product.belongsTo(User, {constraints: true,onDelete:'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through: CartItem});
Product.belongsToMany(Cart,{through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem});

 //sequelize.sync({ force: true })
 sequelize.sync()
.then(result =>{
    return User.findByPk(1);
   // console.log(result);
}).then(user=>{
   if(!user)
    {
        return User.create({name:'Bhupendra',email:'test@test.com'});
    }
    return user;
}
).then(user=>{
    // console.log(user);
   return user.createCart();
}).then(cart=>{
    app.listen(3000);
}).catch(err =>{
    console.log(err);
});