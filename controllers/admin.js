const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: "Add Shop",
        path: '/admin/add-product',
    });
};
exports.getEditProduct = (req, res, next) => {
    const editMode = res.query.edit;
    if (!editMode){
        return res.redirect('/')
    }
    res.render('admin/edit-product', {
        pageTitle: "Edit Page",
        path: '/admin/edit-product',
        editing: editMode
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

