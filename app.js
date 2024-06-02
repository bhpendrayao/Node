
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'ejs');//EJS
app.set('views', 'routes/views');

const path = require('path');
const adminRoutes = require('./routes/admin')
const shoprequest = require('./routes/shop')
const errorcontroller = require('./controllers/error')
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/admin',adminRoutes);
app.use(shoprequest);

app.use(errorcontroller.get404);
// const server=http.createServer(app);

app.listen(3000);