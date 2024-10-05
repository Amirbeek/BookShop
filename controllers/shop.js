const Product = require('../models/product');
const Cart = require('../models/Cart');
const {log} = require("debug");



exports.shopProduct = (req, res, next) => {
    Product.findAll()
        .then(products=>{
            res.render('shop/product-list', {
                prods: products,
                path: '/products',
                pageTitle: "All Page",
                hasProduct: products.length > 0,
                activeShop: false,
                activeAdmin: false,
                activeProduct:true,
                activeCart: false
          });
    }).catch(err=>{
        console.log(err);
    });
};

exports.getIndex = (req,res,next)=>{
    Product.findAll().then(products => {
        res.render('shop/index', {
            prods: products,
            path: '/',
            pageTitle: "Main Page",
        });
    }).catch(err =>{
        console.log(err)
    })
    Product.findByPk().then((products)=>{
        console.log(products)

    }).catch(err=>{
        console.log(err)
    });
}
exports.getCart = (req,res,next)=>{
    Product.fetchAll().then(([products, feta])=>{
        res.render('shop/cart', {
            prods: products,
            path: '/cart',
            pageTitle: "Your Page",
        });
    }).catch(err=>{
        console.log(err)
    });
}
exports.getCart= (req, res, next)=>{


    req.user.getCart().then(cart=>{
        user.createCart
    }).catch(err => console.log(err))
    // Cart.getCart(cart =>{
    //     // Product.fetchAll(([products, feta])=>{
    //     //     const allData = []
    //     //     for (let product of products){
    //     //         const cartProductData = cart.products.find(prod => prod.id === product.id)
    //     //         if (cartProductData){
    //     //             allData.push({productData: product, qty: cartProductData.qty})
    //     //         }
    //     //     }
    //     //     res.render('shop/cart',{
    //     //         path:'/cart',
    //     //         pageTitle: 'Your Cart',
    //     //         cart: allData
    //     //     })
    //     // })
    // })
}
exports.postCart = (req,res,next)=>{
    const prodId = req.body.productId;
    console.log(prodId)
    Product.findByPk(prodId).then(products=>{
        if (!products) return res.redirect('/cart')
        Cart.addProduct(prodId, products.price)
    }).catch(err => console.log(err))
    res.redirect('/cart')
}


exports.Checkout = (req,res,next)=>{
    Product.fetchAll().then(([products, feta] )=>{
        res.render('shop/checkout', {
            prods: products,
            path: '/checkout',
            pageTitle: "Checkout Page",
        });
    }).catch(err =>{
        console.log(err)
    })

}

exports.getProduct = (req,res,next)=>{
    const prodId = req.params.productId;
    // console.log(req.params)
    // Product.findAll({where: {id: prodId}}).then(products =>{
    //     res.render('shop/product-details', {
    //         prods: products[0],
    //         path: '/product',
    //         pageTitle: `Product`,
    //     });
    // }).catch(err=>{
    //     console.log(err)
    // })
    Product.findByPk(prodId).then(products =>{
        res.render('shop/product-details', {
            prods: products,
            path: '/product',
            pageTitle: `Product`,
        });
    }).catch(err=>{
        console.log(err)
    })
}


exports.postCartDelete = (req,res,next)=>{
    const prodId = req.body.id;
    Product.findById(prodId, product =>{
        Cart.deleteProduct(prodId,product.price)
        res.redirect('/')
    })

}