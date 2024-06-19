const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title:{
        type: String,
        required:true
    },
    imageurl:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }

});

module.exports=mongoose.model('Product',productSchema);






// const mongodb = require('mongodb');
// const { name } = require('ejs');
// const { get } = require('../routes/admin');


// const getdb = require('../util/database').getdb;
// class Product{
//   constructor(title,imageurl,description,price,userId,id){
//     this.title=title;
//     this.imageurl=imageurl;
//     this.description=description;
//     this.price=price;
//     this._id= id?new mongodb.ObjectId(id):null;
//     this.userId=userId;
//   }
//   save(){
//     const db = getdb();
//     let dbop;
//     if(this._id)
//       {
//         dbop=db.collection('products').updateOne({_id:this._id},{$set:this});
//       }
//       else{
//       dbop=db.collection('products').insertOne(this);
//       }
//   return dbop.then(result =>{
//     console.log(result);
//   }).catch(err=>{console.log(err)});
//   }


//   static fetchAll(){
//     const db = getdb();
//     return db.collection('products').find().toArray().then(products=>{
//       console.log('idhr');
//       console.log(products);
//       return products;
//     }).catch(err=>{
//       console.log(err);
//     });
//   }


//   static findByPk(prodId){
//     const db = getdb();
//     return db.collection('products').find({_id: new mongodb.ObjectId(prodId)}).next().then(products=>{
//       console.log(products);
//       return products;
//     }).catch(err=>{
//       console.log(err);
//     });
//   }

//   static deletebyid(prodId){
//     const db = getdb();
//     return db.collection('products')
//     .deleteOne({_id: new mongodb.ObjectId(prodId)})
//     .then(result=>{
//       console.log('Deleted');
//     })
//     .catch(err=>{console.log(err)});
//   }

// }

// module.exports = Product;