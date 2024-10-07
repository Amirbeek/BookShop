const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./util/database')
const app = express();
const User  = require('./models/user')


app.set('view engine', 'ejs');
app.set('views', 'views');

// Routes
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    User.findUserById('6703f4087bc916eda50e0139')
        .then(user =>{
            req.user = new User(user.name, user.email, user.cart, user._id)
            next()
        })
        .catch(err=>{
            console.log(err)
        })

})
app.use('/admin', adminRoutes);
app.use(shopRoutes);
// app.use(notExistPage.NotExistPage);

mongoConnect.mongoConnect(client=>{
    // const user  = new User('Amirbek', 'amirbek.shomurodov01@gmail.com')
    // user.save()
    // console.log(client)
    app.listen(3006)

})
