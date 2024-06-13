// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: '123456789',
// });

// module.exports = pool.promise();
///this is for sql mysql
const Sequelize = require('sequelize');
const sequelize = new  Sequelize('node-complete','root','123456789',{
    dialect:'mysql',
    host: 'localhost'
});
module.exports=sequelize;
