
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'ejs');//EJS
app.set('views', 'routes/views');

const path = require('path');
const adminRoutes = require('./routes/admin')
const shoprequest = require('./routes/shop')
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/admin',adminRoutes);
app.use(shoprequest);

app.use((req,res,next)=>{
  res.status(404).render('404',  {pageTitle:'Page Not Found'});
});

// const server=http.createServer(app);

app.listen(3000);