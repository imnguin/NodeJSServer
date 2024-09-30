import mongodb from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const connectString = process.env.MONGO_URI ?? "";
const dbName = process.env.DBNAME_MONGO ?? "";
const MongoClient = mongodb.MongoClient;
let client = null;
let db = null;
let collection = null;

const connect = async () => {
    if (client && client.isConnected()) {
        console.log('Already connected to MongoDB');
        return;
    }
    try {
        client = await MongoClient.connect(connectString, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db(dbName);
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

const disConnect = async () => {
    try {
        if (client) {
            await client.close();
            client = null;
            db = null;
            collection = null;
            console.log('Successfully disconnected from MongoDB');
        }
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        throw error;
    }
};

const createdWithCollection = async (collectionName) => {
    if (!db) {
        throw new Error('Database not initialized. Call connect before createdWithCollection.');
    }
    if (!collection || collection.collectionName !== collectionName) {
        collection = db.collection(collectionName);
        console.log(`Collection ${collectionName} selected`);
    }
};

const get = async (query = {}) => {
    if (!collection) {
        throw new Error('Collection not initialized. Call createdWithCollection before get.');
    }
    try {
        return await collection.find(query).toArray();
    } catch (error) {
        console.error('Error retrieving data from MongoDB:', error);
        throw error;
    }
};

const findOne = async (query = {}) => {
    if (!collection) {
        throw new Error('Collection not initialized. Call createdWithCollection before get.');
    }
    try {
        return await collection.findOne(query);
    } catch (error) {
        console.error('Error retrieving data from MongoDB:', error);
        throw error;
    }
};

const insert = async (object) => {
    if (!collection) {
        throw new Error('Collection not initialized. Call createdWithCollection before insert.');
    }
    try {
        if (Array.isArray(object)) {
            await collection.insertMany(object);
        } else {
            await collection.insertOne(object);
        }
        console.log('Data successfully inserted');
    } catch (error) {
        console.error('Error inserting data into MongoDB:', error);
        throw error;
    }
};

const update = async (object, filter, upsert = true) => {
    if (!collection) {
        throw new Error('Collection not initialized. Call createdWithCollection before update.');
    }
    try {
        const newvalues = { $set: object };
        await collection.updateOne(filter, newvalues, { upsert });
        console.log('Data successfully updated');
    } catch (error) {
        console.error('Error updating data in MongoDB:', error);
        throw error;
    }
};

const deleted = async (filter) => {
    if (!collection) {
        throw new Error('Collection not initialized. Call createdWithCollection before delete.');
    }
    try {
        await collection.deleteOne(filter);
        console.log('Data successfully deleted');
    } catch (error) {
        console.error('Error deleting data from MongoDB:', error);
        throw error;
    }
};

const withMongo = async (collectionName, callback) => {
    try {
        await connect();
        await createdWithCollection(collectionName);
        const result = await callback();
        return result;
    } catch (error) {
        throw error;
    } finally {
        await disConnect();
    }
}

export const MongoData = {
    connect,
    disConnect,
    createdWithCollection,
    get,
    findOne,
    insert,
    update,
    deleted,
    withMongo
};
