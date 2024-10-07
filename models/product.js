const {result} = require("handlebars-helpers/lib/utils/utils");
const {ObjectId} = require("mongodb");
const getDb = require('../util/database').getDb;
class Product {
    constructor(title, price, description, imageUrl,id ,userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new ObjectId(id) : null;
        this.userId = userId;
    }
    save(){
        const db = getDb()
        let dbOP;
        if (this._id){
            dbOP = db.collection('products').updateOne({_id: this._id}, {$set: this})
        }else{
         dbOP = db
             .collection('products')
             .insertOne(this)
        }
        return  dbOP.then(
            result=>{
                console.log(result)
            }
        ).catch(err =>{
            console.log(err)
        })
    }
    static fetchALl(){
        const db = getDb()
        return db.collection('products').find().toArray().then(product =>{
            console.log(product)
            return product
        }).catch(err =>{
            console.log(err)
        })
    }
    static findById(id) {
        const db = getDb();
        return db.collection('products').find({ _id: new ObjectId(id) }).next()
            .then(product => {
                console.log(product)
                return product
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    }
    static deleteById(id) {
        const db = getDb();
        return db.collection('products').deleteOne({ _id: new ObjectId(id) }) // `deleteOne` ni to'g'ri chaqirish
            .then(result => {
                console.log('Deleted successfully');
                return result;
            })
            .catch(err => {
                console.error('Error deleting product:', err);
                throw err;
            });
    }

}
// const  Product = sequelize.define('product', {
//     id:{
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     title: Sequelize.STRING,
//     price:{
//         type: Sequelize.DOUBLE,
//         allowNull: false
//     },
//     imageUrl: {
//         type: Sequelize.TEXT,
//         allowNull: false
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// })

module.exports = Product