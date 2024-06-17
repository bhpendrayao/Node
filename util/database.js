// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: '123456789',
// });

// module.exports = pool.promise();
///this is for sql mysql
const mongodb =require('mongodb');
const MongoClient =  mongodb.MongoClient;

let _db;
const mongoConnect = callback =>{
    MongoClient.connect('mongodb+srv://bt21ece027:6GkU3Xb0PkMun5yB@cluster0.bsclqpp.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
    .then(client=>{
        console.log('CONNECTED!!');
        _db=client.db();
        callback(client);
    }).catch(err=>{
        console.log(err);
        throw err;
    })
}
const getdb = () =>{
    if(_db){
        return _db;
    }
    throw 'No database found!';
}
exports.mongoConnect = mongoConnect;
exports.getdb = getdb;
