const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: "Add Shop",
        path: '/admin/add-product',
        editing: false
    });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit; // Check if it's in edit mode
    const productID = req.params.productId; // Get product ID from URL parameters
    Product.findById(productID).then(product =>{
            if (!product) {
                return res.redirect('/'); // Redirect if product not found
            }
            console.log("Controller: ")
            console.log(product)
            res.render('admin/edit-product', {
                pageTitle: "Edit Product",
                path: '/admin/edit-product',
                editing: editMode,
                product: product // Pass the product data to the template
            });
    }).catch(err =>{
        console.log(err)
    });
};

const { ObjectId } = require('mongodb');
const {populate} = require("dotenv");

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.id;
    const { title, price, imageUrl, description } = req.body;

    Product.findByIdAndUpdate(productId, { title, price, description, imageUrl }, { new: true })
        .then(result => {
            console.log("Product updated:", result);
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.error('Error updating product:', err);
            res.status(500).send('Error updating product');
        });
};

exports.postAddProduct = (req, res, next) => {
    const { title, price, imageUrl, description } = req.body;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user._id
    });
    product.save()
        .then(result => {
            console.log(result);
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.error('Error saving product:', err);
            res.status(500).send('Error saving product');
        });
};

exports.getProducts = (req, res, next) => {
    Product.find()
        .populate('userId')
        .then(products => {
        res.render('admin/products', {
            prods: products,
            path: '/admin/products',
            pageTitle: "Admin Products",
        });
    }).catch(err=>{
        console.log(err)
    });
};

//
exports.deleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    console.log(productId)
    Product.findByIdAndDelete(productId).then( result =>{
        console.log(result)
    }).then(result=>{
        console.log(result)
        res.redirect('/');
    }).catch(err=>{
        console.log(err)
    });
};
