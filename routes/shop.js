// const path = require('path');
// const rootDir = require('../util/path.js');
// const adminData = require('./admin.js')

const express = require('express');
const shopRouter = express.Router();
const shopController = require('../controllers/shop')

shopRouter.get('/', shopController.getIndex);
shopRouter.get('/products',shopController.shopProduct)
shopRouter.get('/cart', shopController.getCart)
shopRouter.get('/checkout', shopController.Checkout)


module.exports = shopRouter;
