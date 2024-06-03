const fs = require('fs');
const path = require('path');

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
  constructor(title , imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
     getproductfromfile(products =>{
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
     });
  }

  static fetchAll(cb) {
   getproductfromfile(cb);
  }

  static findbyid(id, cb){
    getproductfromfile(products=>{
    const product = products.find(p=>p.id === id);
    cb(product);
    });
  }
};
