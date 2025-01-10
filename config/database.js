
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://atarrach77:dataTypeShit1@personal-website-cluste.gt5e7.mongodb.net/';
const client = new MongoClient(uri);

const connectDB = async () => {

    if (db) return db;

    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");
        return client.db("your_database_name");
        return db;
    } catch (error) {
        console.error("Could not connect to MongoDB", error);
        process.exit(1);
    }
};

module.exports = connectDB;
