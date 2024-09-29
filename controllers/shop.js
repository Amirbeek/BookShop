const Product = require('../models/product');



exports.shopProduct = (req, res, next) => {
    Product.fetchAll((products)=>{
      res.render('shop/product-list', {
          prods: products,
          path: '/product',
          pageTitle: "All Page",
          hasProduct: products.length > 0,
          activeShop: false,
          activeAdmin: false,
          activeProduct:true,
          activeCart: false
      });
    });
};

exports.getIndex = (req,res,next)=>{
    Product.fetchAll((products)=>{
        res.render('shop/index', {
            prods: products,
            path: '/',
            pageTitle: "Main Page",
        });
    });
}
exports.getCart = (req,res,next)=>{
    Product.fetchAll((products)=>{
        res.render('shop/cart', {
            prods: products,
            path: '/cart',
            pageTitle: "Your Page",
        });
    });
}
exports.Checkout = (req,res,next)=>{
    Product.fetchAll((products)=>{
        res.render('shop/checkout', {
            prods: products,
            path: '/checkout',
            pageTitle: "Checkout Page",
        });
    });
}

