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

exports.postCart = (req,res,next)=>{
    const prodId = req.body.productId;
    console.log(prodId)
    res.redirect('/cart')
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

exports.getProduct = (req,res,next)=>{
    const prodId = req.params.productId;

    Product.findById(prodId, product =>{
        res.render('shop/product-details', {
            prods: product,
            path: '/product',
            pageTitle: `Product ${product.title}`,
        });

    })


    // res.redirect('/')
}

