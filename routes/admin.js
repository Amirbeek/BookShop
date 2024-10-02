// const path = require('path')
// const rootDir = require('../util/path.js')

const express = require('express');
const router = express.Router();
const productsController = require('../controllers/admin')

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);

// /admin/product => GET
router.get('/products', productsController.getProducts);

router.get('/edit-product/:productId',productsController.getEditProduct);

router.post('/add-product', productsController.postAddProduct);
router.post('/edit-product', productsController.)

module.exports = router;
