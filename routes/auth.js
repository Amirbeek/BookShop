const express = require('express');
const { check,  body }  = require('express-validator');
const authController = require('../controllers/auth');
const User = require('../models/user')
const bcrypt = require("bcryptjs");
const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup',  authController.getSignUp);
router.post('/logout', authController.postLogout)
router.post('/login',
    check('email','Please enter a valid email address.')
        .isEmail()
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(UserDoc => {
                if (!UserDoc) {
                    return Promise.reject('E-mail did not exist!');
                }
            });
        }),
    body('password', 'Password must be at least 6 characters long and alphanumeric.')
        .isLength({ min: 6 })
        .custom((value, { req }) => {
            return User.findOne({ email: req.body.email }).then(async user => {
                if (!user) {
                    return Promise.reject('Invalid email or password.');
                }
                const isPasswordValid = await bcrypt.compare(value, user.password);
                if (!isPasswordValid) {
                    return Promise.reject('Invalid email or password.');
                }
            });
        }),
    authController.postLogin
);

// Signup route
router.post('/signup',
    check('email','Please enter a valid email address.')
        .isEmail()
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(UserDoc => {
                if (UserDoc) {
                    return Promise.reject('E-mail exists already, please pick a different one.');
                }
            });
        }),
    body('password', 'Password must be at least 6 characters long and alphanumeric.')
        .isLength({ min: 6 })
        .isAlphanumeric(),
    body('confirm_password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must match, please check your password!');
            }
            return true; // Validation passes if passwords match
        }),
    authController.postSignUp
);
router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/update-password/:token', authController.getNewPassword);

router.post('/update-password', authController.postNewPassword);

module.exports = router;
