// const fs= require('fs');
// const path = require('path');

// const p = path.join(
//     path.dirname(process.mainModule.filename),
//     'data',
//     'cart.json'
//   );

// module.exports = class Cart{
// static addproduct(id,productPrice){
//     //fetch the previous cart
//     fs.readFile(p,(err, fileContent)=>{
//         let cart = {products: [], totalprice:0};
//         if(!err){
//             cart=JSON.parse(fileContent);
//         }
//         const existingProductIndex = cart.products.findIndex(prod => prod.id===id);
//         const existingProduct = cart.products[existingProductIndex];
//         let updatedProduct; 
//         if(existingProduct){
//            updatedProduct ={...existingProduct};
//            updatedProduct.qty = updatedProduct.qty+1;
//            cart.products=[...cart.products];
//            cart.products[existingProductIndex] = updatedProduct;
//         }else{
//             updatedProduct = {id: id,qty:1};
//             cart.products = [...cart.products, updatedProduct];
//         }
//          cart.totalprice = cart.totalprice+ +productPrice;
//          fs.writeFile(p,JSON.stringify(cart), err =>{
//          });
//         });
//     //analyze the cart => find existing product
//     // add new product product/ increase quantity
// }

// static deleteproduct(id,productPrice){
//     fs.readFile(p,(err, fileContent)=>{
//         if(err){
//             return;
//         }
//         const updatedcart ={...JSON.parse(fileContent)};
//         const product = updatedcart.products.find(prod => prod.id ===id);
//         if(!product)
//             {
//                 return;
//             }
//         const productqty = product.qty;
//         updatedcart.products = updatedcart.products.filter(prod => prod.id !==id);
//         updatedcart.totalprice= updatedcart.totalprice-productPrice*productqty;
//         fs.writeFile(p,JSON.stringify(updatedcart),err=>{
//             console.log(err);
//             console.log("yaha hoon mc");
//         })

//     });
// }
// static getCart(cb)
// {
//     fs.readFile(p,(err,fileContent)=>{
//         const cart = JSON.parse(fileContent);
//         if(err)
//             {
//               cb(null);
//             }
//             else{
//                 cb(cart);
//             }
//     })
// }
// };
const  Sequelize = require('sequelize');

const sequelize =require('../util/database');

const Cart = sequelize.define('cart',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
});
module.exports=Cart;