const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (callback) => {
    const uri = 'mongodb+srv://helloWorld:02012004Wa1111@cluster0.tc9vk.mongodb.net/?retryWrites=true&w=majority'; // Directly use your connection string here
    MongoClient.connect(uri)
        .then(client => {
            console.log("Successfully Connected");
            _db = client.db(); // Get the database instance
            callback(); // Call the callback function after successful connection
        })
        .catch(err => {
            console.log("Database connection failed:", err);
            throw err; // Rethrow the error for handling elsewhere if needed
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw new Error("No database found!");
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
