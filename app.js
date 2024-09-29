const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');
const notExistPage = require('./controllers/error')
const app = express();


// app.engine('ejs'
    // , expressHbs({
    // layoutsDir:'views/layouts/',
    // defaultLayout: 'main-layout',
    // extname:'hbs'})
// );

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

// var convertDateToBinary = function(date) {
//     const num = date.split('-')
//     let answer=''
//     for (const numElement of num) {
//         if (Number(numElement) === 1){
//             answer = answer + 1 + '-'
//         }else{
//             answer = answer + decimalToBinary(Number(numElement)) + '-'
//
//         }
//     }
//     console.log(answer = answer.substring(0, answer.length - 1))
// };
//
// function decimalToBinary(decimalNumber) {
//     return decimalNumber.toString(2);
// };
// convertDateToBinary('1900-01-01')

app.listen(3001);