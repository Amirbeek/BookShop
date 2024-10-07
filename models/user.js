const { ObjectId } = require("mongodb");
const getDb = require('../util/database').getDb;

class User {
    constructor(username, email,cart,id) {
        this.username = username;
        this.email = email;
        this.cart = cart
        this._id = id
    }
    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });

        const updatedCartItems = [...this.cart.items];
        // console.log(updatedCartItems)
        let newQuantity = 1;

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: new ObjectId(product._id),
                quantity: newQuantity
            });
        }

        const updatedCart = {
            items: updatedCartItems
        };

        const db = getDb();

        // Error handling for database operations
        try {
            return db.collection('users').updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: updatedCart } }
            );
        } catch (error) {
            console.error("Failed to update cart: ", error);
            throw new Error("Failed to add product to cart.");
        }
    }
    // Save a user to the database
    save() {
        const db = getDb();
        return db.collection('users')
            .insertOne(this) // Return the promise
            .then(result => {
                console.log("User saved:", result);
            })
            .catch(err => {
                console.log("Error saving user:", err);
            });
    }

    // Static method to find a user by ID
    static findUserById(id) {
        const db = getDb();
        return db.collection('users')
            .findOne({ _id: new ObjectId(id) })
            .then(user => {
                console.log("User found:", user);
                return user;
            })
            .catch(err => {
                console.log("Error finding user:", err);
            });
    }
}

module.exports = User;
