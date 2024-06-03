const fs = require('fs');
const path = require('path');
const Cart = require('./cart')

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getproductfromfile = cb =>{
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    }
    else {
      try {
        const products = JSON.parse(fileContent);
        cb(products);
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        cb([]);
      }
    } 
  });
}

module.exports = class Product {
  constructor(id, title , imageUrl, description, price) {
    this.id =id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
     getproductfromfile(products =>{
        if(this.id)
          {
            const exsistingProductIndex = products.findIndex(prod => prod.id === this.id);
            const updatedproduct = [...products];
            updatedproduct[exsistingProductIndex]=this;
            fs.writeFile(p, JSON.stringify(updatedproduct), err => {
              console.log(err);
            });
          }
          else{
            this.id = Math.random().toString();
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
          }
    
     });
  }

  static fetchAll(cb) {
   getproductfromfile(cb);
  }
  static deletebyid(id){
    getproductfromfile(products =>{
      const product= products.find(prod =>prod.id===id);
      const updatedProducts = products.filter(prod => prod.id!==id);
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if(!err)
          {
             Cart.deleteproduct(id,product.price);
          }
      });
    })

  }
  static findbyid(id, cb){
    getproductfromfile(products=>{
    const product = products.find(p=>p.id === id);
    cb(product);
    });
  }
};
