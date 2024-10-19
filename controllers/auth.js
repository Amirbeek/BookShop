const User = require('../models/user');
const bcrypt = require('bcryptjs');
const sendGrid = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto')



const transporter = sendGrid.createTransport(sendgridTransport({
    auth:{
        api_key: process.env.SENDGRID_API
    }
}))

exports.getLogin = (req, res, next) => {
    let message =  req.flash('err')
    if (message.length > 0 ){
        message = message[0]
    }else {
        message = null
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage:message
    });
};

exports.getSignUp = (req, res, next) => {
    let message =  req.flash('errorSign')
    if (message.length > 0 ){
        message = message[0]
    }else {
        message = null
    }

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign up',
        isAuthenticated: false,
        errorMessage:message
    });
};

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            // No user found, redirect to login with error
            req.flash('error', 'Invalid email or password')
            return res.redirect('/login');
        }

        // Compare the hashed password
        const doMatch = await bcrypt.compare(password, user.password);

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
            req.flash('error', 'Invalid email or password')
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
            req.flash('errorSign', 'Email already exists');
            return res.redirect('/signup');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
        });

        await user.save();

        // Send a beautified confirmation email
        transporter.sendMail({
            to: email,
            from: 'shomurodovamirbek2@gmail.com', // Use a verified SendGrid sender identity
            subject: 'Signup Successful',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 10px;">
                    <h2 style="color: #007BFF; text-align: center;">Welcome to Our Website!</h2>
                    <p>Hi <strong>${email}</strong>,</p>
                    <p>We're excited to have you on board. You have successfully signed up!</p>
                    <p><strong>Here are your next steps:</strong></p>
                    <ul>
                        <li>Explore our platform</li>
                        <li>Start shopping with us</li>
                        <li>Reach out if you have any questions</li>
                    </ul>
                    <p>We hope you enjoy the experience. If you have any questions, feel free to <a href="mailto:support@yourdomain.com">contact us</a>.</p>
                    <p>Best regards,</p>
                    <p><strong>Your Company Team</strong></p>
                    <footer style="text-align: center; margin-top: 20px;">
                        <small>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</small>
                    </footer>
                </div>
            `
        }).catch(err => {
            console.log('Email error:', err);
        });

        res.redirect('/login');
    } catch (err) {
        console.log(err);
        res.redirect('/signup');
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

exports.getReset = (req, res, next)=>{
    let message =  req.flash('err')
    if (message.length > 0 ){
        message = message[0]
    }else {
        message = null
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Login',
        errorMessage:message
    });
}

exports.postReset = (req,res, next)=>{
    crypto.randomBytes(32, (err,buffer)=>{
        if (err){
            console.log(err)
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex')
        User.findOne({email: req.body.email}).then(user =>{
            if (!user){
                req.flash('error', 'No account with email found');
                res.redirect('/')
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save()
        }).then(result =>{
            res.redirect('/')
            transporter.sendMail({
                to: req.body.email,
                from: 'shomurodovamirbek2@gmail.com',
                subject: 'Reset Password',
                html: `<p>Click this <a href="http://localhost:3000/update-password/${token}">link</a> to set a new password</p>`

            })
        }).catch(err =>{
            console.log(err)
        })
    })
}
exports.getNewPassword = (req,res, next)=>{
    const token = req.params.token
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}}).then(user =>{
        res.render('auth/update_password', {
            path: '/update-password',
            pageTitle: 'Reset password',
            isAuthenticated: false,
            errorMessage:message,
            userId: user._id.toString(),
            passwordToken: token
        });
    }).catch(err =>{
        console.log(err)
    })
    let message =  req.flash('error')
    if (message.length > 0 ){
        message = message[0]
    }else {
        message = null
    }
}
exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    console.log("ID: "+userId,"    PS:   "+ newPassword)
    console.log("TOKEN:  "+ passwordToken)
    let nUser ;
    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    })
        .then( user => {
            nUser = user;
            return  bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword =>{
            nUser.password = hashedPassword;
            console.log("hashed-password:      "+hashedPassword)
            nUser.resetToken = undefined;
            nUser.resetTokenExpiration = undefined;
            return nUser.save()
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        });
};
