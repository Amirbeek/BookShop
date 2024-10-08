const Product = require('../models/product');
// const Cart = require('../models/cart');
// const Order = require('../models/order');
const {err, result} = require("handlebars-helpers/lib/utils/utils");

// exports.shopProduct = (req, res, next) => {
//     Product.fetchALl()
//         .then(products=>{
//             res.render('shop/product-list', {
//                 prods: products,
//                 path: '/products',
//                 pageTitle: "All Page",
//                 hasProduct: products.length > 0,
//                 activeShop: false,
//                 activeAdmin: false,
//                 activeProduct:true,
//                 activeCart: false
//           });
//     }).catch(err=>{
//         console.log(err);
//     });
// };

exports.getIndex = (req,res,next)=>{
    Product.find()
        .then(products => {
        res.render('shop/index', {
            prods: products,
            path: '/',
            pageTitle: "Main Page",
        });
    }).catch(err =>{
        console.log(err)
    })
};
exports.shopProduct = (req,res,next)=>{
    Product.find().then(products => {
        res.render('shop/index', {
            prods: products,
            path: '/',
            pageTitle: "Main Page",
        });
    }).catch(err =>{
        console.log(err)
    })
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                cart: products
            });
        })
        .catch(err => {
            console.log(err);
        });
};


exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
    // let fetchCart;
    // let newQuantity = 1;
    //
    // req.user.getCart()
    //     .then(cart => {
    //         if (!cart) {
    //             return req.user.createCart();
    //         }
    //         return cart;
    //     })
    //     .then(cart => {
    //         fetchCart = cart;
    //         return cart.getProducts({ where: { id: prodId } });
    //     })
    //     .then(products => {
    //         let product;
    //         if (products.length > 0) {
    //             product = products[0]; // Existing product in cart
    //             const oldQuantity = product.cartItem.quantity;
    //             newQuantity = oldQuantity + 1;
    //             return fetchCart.addProduct(product, { through: { quantity: newQuantity } });
    //         }
    //         return Product.findByPk(prodId);
    //     })
    //     .then(product => {
    //         if (product) {
    //             return fetchCart.addProduct(product, { through: { quantity: newQuantity } });
    //         }
    //     })
    //     .then(() => {
    //         res.redirect('/cart');
    //     })
    //     .catch(err => console.log(err));
};
//
// exports.Checkout = (req,res,next)=>{
//     Product.fetchAll().then(([products, feta] )=>{
//         res.render('shop/checkout', {
//             prods: products,
//             path: '/checkout',
//             pageTitle: "Checkout Page",
//         });
//     }).catch(err =>{
//         console.log(err)
//     })
//
// };
//
exports.getProduct = (req,res,next)=>{
    const prodId = req.params.productId;
    Product.findById(prodId).then(products =>{
        res.render('shop/product-details', {
            prods: products,
            path: '/product',
            pageTitle: `Product`,
        });
    }).catch(err=>{
        console.log(err)
    })
};

exports.postCartDelete = (req,res,next)=>{
    const prodId = req.body.id;
        req.user.removeFromCart(prodId)
            .then(products =>{
        }).then(result =>{
            res.redirect('/cart')
        }).catch(err =>{
            console.log(err)
        })

}
//
exports.getOrders = (req, res, next) => {
    req.user.getOrder()
        .then(orders => {
            console.log(orders);
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: "Orders page",
                orders: orders
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).render('error', { errorMessage: 'Unable to fetch orders.' });
        });
};

exports.postOrder = (req, res, next) => {
    req.user
        .addOrders()
        .then(result => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            res.status(500).render('error', { errorMessage: 'Unable to place order.' });
        });
};
