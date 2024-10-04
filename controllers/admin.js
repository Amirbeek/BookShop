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
    req.user.getProducts({where: {id: productID}}).then(product =>{
            product = product[0]
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

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.id;
    const { title, price, imageUrl, description } = req.body;
    Product.findByPk(productId)
        .then(product =>{
        product.title = title
        product.price = price
        product.imageUrl = imageUrl
        product.description = description
        return  product.save()
    }).then(result=>{
        console.log(result)
        res.redirect('/products');
    }).catch(err =>{
        console.log(err)
    });

};

exports.postAddProduct = (req, res, next) => {
    const { title, price, imageUrl, description } = req.body;
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    }).then(user => {
        console.log(user); // This will log the user (either newly created or existing)
        res.redirect('/admin/products')  // Error: res is not defined
    }).catch(err => {
            // console.error(err);
            res.status(500).json({ message: 'Failed to create product', error: err });
        });
};

exports.getProducts = (req, res, next) => {
    req.user.getProducts().then((products) => {
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
    Product.findByPk(productId).then( product =>{
        return product.destroy()
    }).then(result=>{
        console.log(result)
        res.redirect('/');
    }).catch(err=>{
        console.log(err)
    });
};
