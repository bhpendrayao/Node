
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// const expresshbs = require('express-handlebars')

// app.engine('hbs',expresshbs({layoutDir:'routes/views/layouts/', defaultLayout:'main-layout', extname: 'hbs'}));
// app.set('view engine', 'hbs');//handlebarsS
app.set('view engine', 'ejs');//EJS
// app.set('view engine', 'pug'); PUG template engines
app.set('views', 'routes/views');

const path = require('path');
const adminData = require('./routes/admin')
const shoprequest = require('./routes/shop')
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/admin',adminData.routes);
app.use(shoprequest);

app.use((req,res,next)=>{
  res.status(404).render('404',  {pageTitle:'Page Not Found'});
});

// const server=http.createServer(app);

app.listen(3000);