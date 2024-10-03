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
    if (!editMode) {
        return res.redirect('/');
    }
    const productID = req.params.productId; // Get product ID from URL parameters
    Product.findById(productID, (product) => {
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
    const newProduct = new Product(
        null,
        req.body.title,
        req.body.imgUrl,
        req.body.description,
        req.body.price
    );
    newProduct.save(); // Save a new product
    res.redirect('/'); // Redirect after saving
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            prods: products,
            path: '/admin/products',
            pageTitle: "Admin Products",
        });
    });
};
exports.deleteProduct = (req, res, next) => {
    const productId = req.body.productId; // Get the product ID from the request body
    console.log(productId)
    Product.deleteById(productId, () => {
        res.redirect('/admin/products');
    });
};
