const User = require('../models/user');
const bcryptjs = require('bcryptjs')
exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignUp = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign up',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                // No user found, redirect to login
                return res.redirect('/login');
            }

            // Compare the hashed password
            return bcryptjs.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        // Passwords match, log in the user
                        req.session.isLoggedIn = true;
                        req.session.user = user;

                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    } else {
                        // Passwords don't match, redirect to login
                        return res.redirect('/login');
                    }
                })
                .catch(err => {
                    // Error in bcrypt.compare
                    console.log(err);
                    res.redirect('/login');
                });
        })
        .catch(err => {
            // Error in finding the user
            console.log(err);
            res.redirect('/login');
        });
};


exports.postSignUp = (req, res, next) => {
    const { email, password, confirm_password } = req.body
    console.log('Password:', password);
    User.findOne({ email: email })
       .then(userDoc=>{
           if (userDoc){
               return res.redirect('/signup');
           }
           return bcryptjs.hash(password, 12).then(hashedPassword=>{
               const user = new User({
                   email: email,
                   password: hashedPassword,
                   cart: { items: [] }
               });
               return user.save();
           }).then(result =>{
               res.redirect('/login');
           });
   }).catch(err=>{
       console.log(err)})
};


exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
