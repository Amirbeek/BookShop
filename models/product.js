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
module.exports = class Product {
    constructor(title,imgUrl, description, price) {
        this.title = title;
        this.imgUrl = imgUrl
        this.description = description;
        this.price = price;
    }

    save() {
        getProductFromFile(products =>{
            this.id = Math.random().toString()
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err)
            })
        })
    }

    static fetchAll(cb) {
        getProductFromFile(cb)
    }

    static findById(id,cb){
        getProductFromFile(products =>{
            const product = products.find(p => p.id === id )
            cb(product)
        })
    }
};
