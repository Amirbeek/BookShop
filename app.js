const path = require('path');
const csrf = require('csurf');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBS = require('connect-mongodb-session')(session);
const flash =require('connect-flash')
const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = process.env.DATABASE_URL;
const app = express();

// Set up MongoDB session store
const store = new MongoDBS({
    uri: MONGODB_URI,
    collection: 'sessions',
});

// CSRF protection setup
const csrfProtection = csrf();

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', 'views');

// Route handlers
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Session management
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

// Use CSRF protection middleware after session middleware
app.use(csrfProtection);

app.use(flash())

// User authentication middleware
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
            next(); // Call next to continue handling the request
        });
});
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken(); // Set CSRF token for views
    next();
});
// Define routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Error handling middleware for 404 errors
app.use(errorController.get404);

// Connect to MongoDB and start the server
mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(result => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000'); // Added success message for server start
        });
    })
    .catch(err => {
        console.error('Database connection error:', err); // Improved error logging
    });
