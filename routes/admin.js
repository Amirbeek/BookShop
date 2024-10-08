const express = require('express');
const router = express.Router();
const productsController = require('../controllers/admin');

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);
// //
// // // /admin/products => GET
router.get('/products', productsController.getProducts);
// //
// // // /admin/edit-product/:productId => GET
router.get('/edit-product/:productId', productsController.getEditProduct);
//
// /admin/add-product => POST
router.post('/add-product', productsController.postAddProduct);
//
// // /admin/edit-product => POST
router.post('/edit-product', productsController.postEditProduct);
// //
// // // /admin/delete-product =>
router.post('/delete-product', productsController.deleteProduct);

module.exports = router;
