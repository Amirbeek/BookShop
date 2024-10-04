const Product = require("../models/product");
const {log} = require("debug");
const {result} = require("handlebars-helpers/lib/utils/utils");

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: "Add Shop",
        path: '/admin/add-product',
        editing: false
    });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit; // Check if it's in edit mode
    if (!editMode) {
        return res.redirect('/');
    }
    const productID = req.params.productId; // Get product ID from URL parameters
    Product.findByPk(productID, (product) => {
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
    });
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.id; // Get the product ID from the request body
    console.log("Edit Product: "+productId)
    // Find the product by ID
    Product.findById(productId, (product) => {
        if (!product) {
            return res.redirect('/'); // If product is not found, redirect
        }

        // Update the product's properties
        product.title = req.body.title;
        product.imgUrl = req.body.imgUrl;
        product.description = req.body.description;
        product.price = req.body.price;

        // Save the updated product
        product.save(); // This will now update the existing product
        res.redirect('/products'); // Redirect after saving
    });
};

exports.postAddProduct = (req, res, next) => {
    const { title, price, imageUrl, description } = req.body;

    Product.create({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    })
        .then(result => {
            res.redirect('/')
        })
        .catch(err => {
            // console.error(err);
            res.status(500).json({ message: 'Failed to create product', error: err });
        });
};

exports.getProducts = (req, res, next) => {
    Product.findAll().then((products) => {
        res.render('admin/products', {
            prods: products,
            path: '/admin/products',
            pageTitle: "Admin Products",
        });
    }).catch(err=>{
        console.log(err)
    });
};
exports.deleteProduct = (req, res, next) => {
    const productId = req.body.productId; // Get the product ID from the request body
    console.log(productId)
    Product.deleteById(productId, () => {
        res.redirect('/admin/products');
    });
};
