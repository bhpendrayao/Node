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
      const products = JSON.parse(fileContent);
      cb(products);
  } 
  });
}

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
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
};
