require('dotenv').config();
console.log("MongoDB URI:", process.env.MONGO_URI);
const path = require('path');
const csrf = require('csurf');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBS = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const errorController = require('./controllers/error');
const User = require('./models/user');
const multer = require('multer')
const app = express();


const store = new MongoDBS({
    uri: process.env.MONGO_URI,
    collection: 'sessions',
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const {diskStorage} = require("multer");



const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// BodyParse and Multer middleware setup
app.use(multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
}).single('image'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));

app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);


app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            console.error('Error fetching user:', err);
            next(new Error(err))
        });
});
app.use(csrfProtection);
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', errorController.get500)
app.use(errorController.get404);
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(result => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');

        });
    })
    .catch(err => {
        console.log(err)
    });
