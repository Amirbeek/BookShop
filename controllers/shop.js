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
    Product.fetchALl().then(products => {
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
    Product.fetchALl().then(products => {
        res.render('shop/index', {
            prods: products,
            path: '/',
            pageTitle: "Main Page",
        });
    }).catch(err =>{
        console.log(err)
    })
};

// exports.getCart = (req, res, next) => {
//     req.user.getCart().then(cart=>{
//         return cart.getProducts().then(products=>{
//             res.render('shop/cart',{
//                 path:'/cart',
//                 pageTitle: 'Your Cart',
//                 cart: products
//             })
//         }).catch(err=>{
//             console.log(err)
//         })
//     }).catch(err =>{
//         console.log(err)
//     })
// };
//
// exports.postCart = (req, res, next) => {
//     const prodId = req.body.productId;
//     let fetchCart;
//     let newQuantity = 1;
//
//     req.user.getCart()
//         .then(cart => {
//             if (!cart) {
//                 return req.user.createCart();
//             }
//             return cart;
//         })
//         .then(cart => {
//             fetchCart = cart;
//             return cart.getProducts({ where: { id: prodId } });
//         })
//         .then(products => {
//             let product;
//             if (products.length > 0) {
//                 product = products[0]; // Existing product in cart
//                 const oldQuantity = product.cartItem.quantity;
//                 newQuantity = oldQuantity + 1;
//                 return fetchCart.addProduct(product, { through: { quantity: newQuantity } });
//             }
//             return Product.findByPk(prodId);
//         })
//         .then(product => {
//             if (product) {
//                 return fetchCart.addProduct(product, { through: { quantity: newQuantity } });
//             }
//         })
//         .then(() => {
//             res.redirect('/cart');
//         })
//         .catch(err => console.log(err));
// };
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

// exports.postCartDelete = (req,res,next)=>{
//     const prodId = req.body.id;
//     req.user.getCart().then(cart =>{
//         return cart.getProducts({where: {id: prodId}})
//             .then(products =>{
//             const product = products[0]
//             return product.cartItem.destroy()
//         }).then(result =>{
//             res.redirect('/cart')
//         }).catch(err =>{
//             console.log(err)
//         })
//     }).catch(err =>{
//         console.log(err)
//     })
//
// }
//
// exports.getOrders = (req, res, next) => {
//     req.user.getOrders({include: ['products']})
//         .then(orders => {
//             console.log(orders)
//             res.render('shop/orders', {
//                 path: '/orders',
//                 pageTitle: "Orders page",
//                 orders: orders
//             });
//         })
//         .catch(err => {
//             console.error(err);
//             res.status(500).render('error', { errorMessage: 'Unable to fetch orders.' });
//         });
// };
//
// exports.postOrder = (req, res, next) => {
//     let fetchCart;
//     req.user.getCart()
//         .then(cart => {
//             if (!cart) {
//                 throw new Error("Cart not found");
//             }
//             fetchCart = cart;
//             return cart.getProducts();
//         })
//         .then(products => {
//             if (products.length === 0) {
//                 throw new Error("No products in cart");
//             }
//             return req.user.createOrder().then(order => {
//                 const orderItems = products.map(product => {
//                     product.orderItem = { quantity: product.cartItem.quantity };
//                     return product;
//                 });
//                 return order.addProducts(orderItems);
//             });
//         })
//         .then(result => {
//             return fetchCart.setProducts(null);
//         })
//         .then(() => {
//             res.redirect('/orders');
//         })
//         .catch(err => {
//             console.error(err);
//             res.status(500).render('error', { errorMessage: 'Something went wrong while creating the order!' });
//         });
// };