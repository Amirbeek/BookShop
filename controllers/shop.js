const Product = require('../models/product');
const Cart = require('../models/Cart');



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
exports.getCart= (req, res, next)=>{

    Cart.getCart(cart =>{
        Product.fetchAll(products=>{
            const allData = []
            for (let product of products){
                const cartProductData = cart.products.find(prod => prod.id === product.id)
                if (cartProductData){
                    allData.push({productData: product, qty: cartProductData.qty})
                }
            }
            res.render('shop/cart',{
                path:'/cart',
                pageTitle: 'Your Cart',
                cart: allData
            })
        })
    })
}
exports.postCart = (req,res,next)=>{
    const prodId = req.body.productId;
    console.log(prodId)
    Product.findById(prodId,products=>{
        if (!products) return res.redirect('/cart')
        Cart.addProduct(prodId, products.price)
    })
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
    console.log(req.params)

    Product.findById(prodId, product =>{
        res.render('shop/product-details', {
            prods: product,
            path: '/product',
            pageTitle: `Product `,
        });
    })
}


exports.postCartDelete = (req,res,next)=>{
    const prodId = req.body.id;
    Product.findById(prodId, product =>{
        Cart.deleteProduct(prodId,product.price)
        res.redirect('/')
    })

}