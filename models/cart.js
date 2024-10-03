const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err && fileContent.length > 0) {
                cart = JSON.parse(fileContent); // If file is not empty, parse the existing content

            }
            // Ensure products array exists
            if (!cart.products) {
                cart.products = [];
            }

            // Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;

            // Update quantity if the product exists, otherwise add a new product
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty += 1;
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products.push(updatedProduct); // Add new product to the cart
            }

            // Update the total price
            cart.totalPrice = cart.totalPrice + +productPrice;

            // Save the updated cart to the file
            fs.writeFile(p, JSON.stringify(cart), err => {
                if (err) {
                    console.log('Error writing to cart file:', err);
                }
            });
        });
    }
    static deleteProduct(id, price){
        fs.readFile(p, (err, fileContent)=>{
            const cart = JSON.parse(fileContent)
            if (err){
                return
            }{
                const updateCart = {...cart}
                const product = updateCart.products.find(prod=> prod=> prod.id === id);
                if (!product){
                    return;
                }
                const productQty = product.qty
                updateCart.products = updateCart.products.filter(prod => prod.id !== id);

                updateCart.totalPrice = updateCart.totalPrice - price * productQty
                fs.writeFile(p, JSON.stringify(updateCart), err => {
                    if (err) {
                        console.log('Error writing to cart file:', err);
                    }
                });
            }
        })
    }
    static getCart(cb){
        fs.readFile(p,(err, fileContent)=>{
            const cartContent = JSON.parse(fileContent);
            if (err){
                cb(null)
            }else{
                cb(cartContent)
            }
        })
    }
}
