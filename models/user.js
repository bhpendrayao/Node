const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
   
    email:{
        type:String,
        required:true
    }, 
    password:{
        type:String,
        required:true
    },
    resetToken: String,
    resetTokenExpiration:Date,
    cart:{
        items:[
            {
                productId:{type:Schema.Types.ObjectId,ref:'Product',required:true},
                quantity:{type:Number,required:true}
            }
        ]
    }  
});
userSchema.methods.addToCart = function(product){
    const cartproductIndex = this.cart.items.findIndex(cp=>{
                return cp.productId.toString() === product._id.toString();
             });
             let newquantity = 1;
             const updatedcartItem=[...this.cart.items];
             if(cartproductIndex>=0)
                {
                    newquantity = this.cart.items[cartproductIndex].quantity+1;
                    updatedcartItem[cartproductIndex].quantity=newquantity;
                }
            else{
                updatedcartItem.push({productId: product._id,quantity: newquantity});
            }
            const updatedcart ={items:updatedcartItem};
           //const updatedcart ={items:[{productId: new mongodb.ObjectId(product._id),quantity: 1}]}
           this.cart=updatedcart;
           return this.save();
}
userSchema.methods.deleteitemfromcart = function(prodId){
    const updatedcartItem = this.cart.items.filter(item=>{
                    return item.productId.toString()!==prodId.toString();
                });
                this.cart.items=updatedcartItem;
                return this.save();
}
userSchema.methods.clearCart = function(){
    this.cart = {items:[]};
    return this.save();
}
module.exports = mongoose.model('User',userSchema);

// const getdb = require('../util/database').getdb;
// const mongodb = require('mongodb');

// const db= require('../util/database').getdb;
// class User{
//     constructor(username,email,cart,id){
//         this.name  = username;
//         this.email = email;
//         this.cart = cart;
//         this._id=id;
//     }
//     save(){
//         const db =getdb();
//         return db.collection('users').insertOne(this);
//     }

//     addToCart(product){
//      const cartproductIndex = this.cart.items.findIndex(cp=>{
//         return cp.productId.toString() === product._id.toString();
//      });
//      let newquantity = 1;
//      const updatedcartItem=[...this.cart.items];
//      if(cartproductIndex>=0)
//         {
//             newquantity = this.cart.items[cartproductIndex].quantity+1;
//             updatedcartItem[cartproductIndex].quantity=newquantity;
//         }
//     else{
//         updatedcartItem.push({productId: new mongodb.ObjectId(product._id),quantity: newquantity});
//     }
//     const updatedcart ={items:updatedcartItem};
//    //const updatedcart ={items:[{productId: new mongodb.ObjectId(product._id),quantity: 1}]}
//     const db =getdb();
//     return db.collection('users').updateOne(
//         {_id: new mongodb.ObjectId(this._id)},
//         {$set: {cart:updatedcart}}
//         );
//     }

//     getCart(){
//         const db =getdb();
//         const productids = this.cart.items.map(i=>{
//             return i.productId;
//         });
//         return db.collection('products')
//         .find({_id:{$in:productids}})
//         .toArray()
//         .then(products =>{
//         return products.map(p=>{
//             return {...p,quantity:this.cart.items.find(i=>{
//                 return i.productId.toString()===p._id.toString();
//             }).quantity};
//         });
//         });
//     }

//     deleteitemfromcart(prodId){
//         console.log("aya hoon idhr main");
//         const updatedcartItem = this.cart.items.filter(item=>{
//             return item.productId.toString()!==prodId.toString();
//         });
//         console.log(updatedcartItem);
//         const db =getdb();
//         return db
//         .collection('users')
//         .updateOne(
//             {_id: new mongodb.ObjectId(this._id)},
//             {$set: {cart:{items:updatedcartItem}}}
//             );
//     }

//     addOrder(){
//         const db=getdb();
//         return this.getCart().then(products=>{
//             const order={
//                 items:products,
//                 user:{
//                     _id: new mongodb.ObjectId(this._id),
//                     name:this.name
//                 }
//             };
//         return db.collection('orders').insertOne(order);
//         }).then(result=>{
//             this.cart={items:[]};
//         return db
//         .collection('users')
//         .updateOne(
//             {_id: new mongodb.ObjectId(this._id)},
//             {$set: {cart:{items:[]}}}
//             );
//         });
//     }

//     getOrders(){
//         const db= getdb();
//         return db.collection('orders').find({'user._id':new mongodb.ObjectId(this._id)})
//         .toArray();
//     }
//     static findById(userid){
//         const db =getdb();
//         return db.collection('users').findOne({_id: new mongodb.ObjectId(userid)}).then(user=>{
//             console.log(user);
//             return user;
//         }).catch(err=>{console.log(err)});
//     }
// }
// module.exports = User;