
const connectDB = require('../config/database');

const insertData = async (req, res, collectionName) => {
    const db = await connectDB();
    const collection = db.collection(collectionName);

    try {
        const result = await collection.insertOne(req.body);
        res.status(201).send(`Data inserted into ${collectionName} with _id: ${result.insertedId}`);
    } catch (error) {
        console.error("Error inserting data into ${collectionName}:", error);
        res.status(500).send("Error inserting data");
    }
};

module.exports = { insertData };
