const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// const mongoConnect = require('./util/database')
const app = express();
const User  = require('./models/user')
const mongoose =  require('mongoose')

app.set('view engine', 'ejs');
app.set('views', 'views');

// Routes
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findById('')
        .then(user =>{
            req.user = user
            next()
        })
        .catch(err=>{
            console.log(err)
        })

})
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use((req,res,next)=>{
    res.status(404).render('404',{
        pageTitle: "404 page"
    })
})
mongoose.connect('mongodb+srv://helloWorld:02012004Wa1111@cluster0.tc9vk.mongodb.net/?retryWrites=true&w=majority')
    .then(result=>{
    console.log('Mongoose is connected! and app is running')
        User.findOne().then(user=>{
            if (!user){
                const user= new User({
                    name:"amir",
                    email:"amir@gmail.com",
                    cart:{
                        items:[]
                    }
                })
                user.save()
            }
        }).catch(err =>{
            console.log(err)
        })
    app.listen(3030)
}).catch(err =>{
    console.log(err)
})
