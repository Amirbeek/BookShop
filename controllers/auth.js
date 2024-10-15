const User = require('../models/user');
const bcryptjs = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
    });
};

exports.getSignUp = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign up',
        isAuthenticated: false,
    });
};

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            // No user found, redirect to login with error
            return res.redirect('/login');
        }

        // Compare the hashed password
        const doMatch = await bcryptjs.compare(password, user.password);

        if (doMatch) {
            // Passwords match, log in the user
            req.session.isLoggedIn = true;
            req.session.user = user;

            await req.session.save(err => {
                if (err) {
                    console.log(err);
                }
                res.redirect('/');
            });
        } else {
            return res.redirect('/login');
        }
    } catch (err) {
        console.log(err);
        res.redirect('/login');
    }
};

exports.postSignUp = async (req, res, next) => {
    const { email, password, confirm_password } = req.body;

    try {
        const userDoc = await User.findOne({ email: email });

        if (userDoc) {
            return res.redirect('/signup');
        }

        const hashedPassword = await bcryptjs.hash(password, 12);

        const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
        });

        await user.save();
        res.redirect('/login');
    } catch (err) {
        console.log(err);
        res.redirect('/signup'); // Optional: redirect to signup on error
    }
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
};
