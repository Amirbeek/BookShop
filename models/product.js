const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(
        process.mainModule.filename),
    'data',
    'products.json'
);
const   getProductFromFile = cb =>{
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            console.error("Error reading file:", err);
            return cb([]);
        }else{
            cb(JSON.parse(fileContent));
        }
    });
}
const Cart = require('./cart')
module.exports = class Product {
    constructor(id,title,imgUrl, description, price) {
        this.id = id
        this.title = title;
        this.imgUrl = imgUrl
        this.description = description;
        this.price = price;
    }

    save() {
        getProductFromFile(products => {
            if (this.id) {
                // Update existing product
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                if (existingProductIndex >= 0) {
                    products[existingProductIndex] = this; // Update the product
                }
            } else {
                // New product creation
                this.id = Math.random().toString(); // Generate a new ID
                products.push(this); // Add the new product to the array
            }
            fs.writeFile(p, JSON.stringify(products), err => {
                if (err) {
                    console.error("Error saving product:", err);
                }
            });
        });
    }
    static fetchAll(cb) {
        getProductFromFile(cb)
    }
    static findById(id, cb) {
        getProductFromFile(products => {
            const productData = products.find(p => p.id === id);
            if (productData) {
                const product = new Product(
                    productData.id,           // Pass the ID first
                    productData.title,        // Then title
                    productData.imgUrl,       // Then imgUrl
                    productData.description,  // Then description
                    productData.price         // Finally, price
                );
                console.log("Model:")
                console.log(productData)
                cb(product);
            } else {
                cb(null); // Return null if not found
            }
        });
    }

    static deleteById(id, cb) {
        getProductFromFile(products => {
            const productToDelete = products.find(prod => prod.id === id); // Find the product to delete
            const updatedProducts = products.filter(prod => prod.id !== id); // Filter out the product with the specified ID

            // Write the updated product list back to the file
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if (err) {
                    console.error("Error deleting product from products file:", err);
                } else {
                    // Now, delete the product from the cart
                    if (productToDelete) {
                        Cart.deleteProduct(id, productToDelete.price); // Pass the price of the product
                    }
                }
                cb();
            });
        });
    }

};
