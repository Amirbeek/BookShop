const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');
const notExistPage = require('./controllers/error')
const db = require('./util/database')
const app = express();


// app.engine('ejs'
    // , expressHbs({
    // layoutsDir:'views/layouts/',
    // defaultLayout: 'main-layout',
    // extname:'hbs'})
// );

app.set('view engine', 'ejs');
app.set('views',  'views');


// Routes
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
// db.execute('SELECT * FROM products').then((result)=>{
//     console.log(result)
// }).catch((err)=>{
//     console.log(err)
// });

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);



app.use(notExistPage.NotExistPage);

app.listen(3000);