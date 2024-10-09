const express = require('express');
const shopRouter = express.Router();
const shopController = require('../controllers/shop');


shopRouter.get('/', shopController.getIndex);

shopRouter.get('/products/:productId', shopController.getProduct);

shopRouter.post('/add-to-cart', shopController.postCart);

shopRouter.get('/products', shopController.shopProduct);

shopRouter.get('/cart', shopController.getCart);

shopRouter.post('/delete-cart-item', shopController.removeFromCart);

shopRouter.post('/create-order', shopController.postOrder);

shopRouter.get('/orders', shopController.getOrders);

// Export the router
module.exports = shopRouter;
