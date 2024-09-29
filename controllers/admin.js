const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: "Add Shop",
        path: '/admin/add-product',
        activeShop: false,
        activeAdmin: true,
        activeProduct:false,
        activeCart: false

    });
};

exports.postAddProduct = (req, res, next) => {
    const newProduct = new Product(
        req.body.title,
        req.body.imgUrl,
        req.body.description,
        req.body.price);

    newProduct.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products)=>{
        res.render('admin/products', {
            prods: products,
            path: '/admin/products',
            pageTitle: "Admin Products",
        });
    });
};

