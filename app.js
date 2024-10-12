const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const User  = require('./models/user')
const mongoose =  require('mongoose')
const session = require('express-session');
const MongoDbSession = require('connect-mongodb-session')(session)
const error= require('./controllers/error')
const MONGODB_URI ="mongodb+srv://helloWorld:02012004Wa1111@cluster0.tc9vk.mongodb.net/?retryWrites=true&w=majority"
app.set('view engine', 'ejs');
app.set('views', 'views');
const store = new MongoDbSession({
    uri: MONGODB_URI,
    collection: 'session'
})
// Routes
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const auth = require('./routes/auth.js');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.use((req, res, next) => {
    User.findById('67058fd708c97a80cda6f425')
        .then(user => {
            if (!user) {
                console.log('User not found');
                return res.status(404).send('User not found');
            }
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('An error occurred while retrieving the user.');
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(auth);
app.use(error.NotExistPage)
mongoose.connect(MONGODB_URI)
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
    app.listen(3030, ()=>{
        console.log("server is running on 3030")
    })
}).catch(err =>{
    console.log(err)
})
