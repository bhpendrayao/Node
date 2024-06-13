// const cart = require('./cart');

// const db = require('../util/database')

// module.exports = class Product {
//   constructor(id, title , imageUrl, description, price) {
//     this.id =id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     return db.execute('INSERT INTO products(title,price,description,imageurl) VALUES (?, ?, ?, ?)',[this.title,this.price,this.description,this.imageUrl]);
//   }

//   static fetchAll() {
//    return  db.execute('SELECT * FROM products');
//   }
//   static deletebyid(id){

//   }
//   static findbyid(id){
//    return db.execute('SELECT * FROM products WHERE products.id=?', [id] );
// }
// };
///THIS ALL IS FOR SQL
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title:{
    type:Sequelize.STRING,
    allowNull: false,
  },
  price:{
    type:Sequelize.INTEGER,
    allowNull: false,
  },
  description:{
    type:Sequelize.STRING,
    allowNull: false,
  },
  imageurl:{
    type:Sequelize.STRING,
    allowNull: false,
  }
});
module.exports = Product;