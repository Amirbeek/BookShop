const Product = require('../models/product');
const { validationResult } = require('express-validator');
const fileHelper = require('../util/file')
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn,
        hasError: false,
        errorMessage: [],
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);

    if (!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: [{"msg": "Attached file is not an image."}],
            isAuthenticated: req.session.isLoggedIn
        });
    }

    const imageUrl = image.path;

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: errors.array(),
            isAuthenticated: req.session.isLoggedIn
        });
    }

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });

    product
        .save()
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.error(err); // log the error for debugging
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit === 'true';
    if (!editMode) {
        return res.redirect('/');
    }

    if (!req.session.isLoggedIn) {
        return res.redirect('/');
    }

    const errors = validationResult(req);

    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                isAuthenticated: req.session.isLoggedIn,
                hasError: false,
                errorMessage: [],
            });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updatedDesc = req.body.description;
    const errors = validationResult(req);

    // Validate inputs first
    if (!errors.isEmpty()) {
        return Product.findById(prodId)
            .then(product => {
                return res.status(422).render('admin/edit-product', {
                    pageTitle: 'Edit Product',
                    path: '/admin/edit-product',
                    editing: true,
                    hasError: true,
                    product: {
                        _id: product._id,
                        title: updatedTitle,
                        price: updatedPrice,
                        description: updatedDesc
                    },
                    errorMessage: errors.array(),
                    isAuthenticated: req.session.isLoggedIn
                });
            })
            .catch(err => {
                console.log(err)
            });
    }
    Product.findById(prodId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            if (image){
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = image.path;
            }
            return product.save();
        })
        .then(result => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500
            return next(error);
        });
};

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                isAuthenticated: req.session.isLoggedIn,
                errorMessage: null,
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500
            return next(error)
        });
};

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return next(new Error('Product not found'));
            }
            fileHelper.deleteFile(product.imageUrl);
            return Product.deleteOne({ _id: prodId, userId: req.user._id });
        })
        .then(() => {
            console.log('DESTROYED PRODUCT');
            res.status(200).json({message:"Success!"})
        })
        .catch(err => {
            const error = new Error(err);
            res.status(500).json({message:"Deleting product Failed"})
        });
};

