const Product = require('../models/product');
const Order = require('../models/order');
const fs = require('fs')
const path = require('path')
const {or} = require("sequelize");
exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/'); // Or render an error page
            }
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products',
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/'); // Redirect or render an error page
        });
};


exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn,
        csrfToken: req.csrfToken()
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/'); // or an error page
    }

    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
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
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = async (req, res, next) => {
    if (!req.user) {
        return res.redirect('/'); // or an error page
    }

    try {
        const user = await req.user.populate('cart.items.productId').execPopulate();
        const products = user.cart.items.map(i => {
            return { quantity: i.quantity, product: { ...i.productId._doc } };
        });

        const order = new Order({
            user: {
                email: req.user.email,
                userId: req.user
            },
            products: products
        });

        await order.save();
        await req.user.clearCart();
        res.redirect('/orders');
    } catch (err) {
        console.log(err);
        res.redirect('/'); // Redirect or render an error page
    }
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch(err => console.log(err));
};

exports.getInvoice = (req, res, next) => {
    const orderID = req.params.orderId;
    Order.findById(orderID).then(order=>{
        if (!order){
            return next(new Error("No Order found"))
        }
        if (order.user.userId.toString() !== req.user._id.toString()){
            return next(new Error('Unauthorized'))
        }
        const invoiceName = 'invoice-' + orderID + '.pdf';
        const invoicePath = path.join('data', 'invoice', invoiceName); // Use resolve for better path handling

        fs.readFile(invoicePath, (err, data) => {


            res.setHeader('Content-Type', 'application/pdf'); // inline help us to open pdf on one page
            res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`); // Optional: download prompt
            res.send(data);
        });
    }).catch(err=>{
        console.log(err)
    })

};
