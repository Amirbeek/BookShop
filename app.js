const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');
const notExistPage = require('./controllers/error')
const sequelize = require('./util/database')


const app = express();


app.set('view engine', 'ejs');
app.set('views',  'views');


// Routes
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);



app.use(notExistPage.NotExistPage);
sequelize.sync() // this will drop and recreate the table
    .then(result => {
        console.log('Synced with database successfully!');
        app.listen(3000)
    })
    .catch(err => {
        console.error('Failed to sync with database', err);
    });

