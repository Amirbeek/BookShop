const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');
const notExistPage = require('./controllers/error');
const mongoConnect = require('./util/database')
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// Routes
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
// app.use(notExistPage.NotExistPage);

mongoConnect.mongoConnect(client=>{
    // console.log(client)
    app.listen(3002)

})
