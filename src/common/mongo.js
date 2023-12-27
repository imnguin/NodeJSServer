import mongodb from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const connectString = process.env.MONGO_URI ?? "";
const dbName = process.env.DBNAME_MONGO ?? "";
const MongoClient = mongodb.MongoClient;
let client;
let db;
let collection;

const connect = async () => {
    try {
        client = await MongoClient.connect(connectString);
        db = client.db(dbName);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

const disConnect = async () => {
    try {
        if (client) {
            await client.close();
        }
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        throw error;
    }
};

const createdWithCollection = async (collectionName) => {
    if (!collection) {
        collection = await db.collection(collectionName);
    }
};

const get = async (query = {}) => {
    if (!collection) {
        throw new Error('Collection not initialized. Call createdWithCollection before get.');
    }
    return await collection.find(query).toArray();
};

const insert = async (object) => {
    if (!collection) {
        throw new Error('Collection not initialized. Call createdWithCollection before insert.');
    }
    if (object instanceof Array) {
        await collection.insertMany(object);
    } else {
        await collection.insertOne(object);
    }
};

const update = async (object, filter, upsert = true) => {
    if (!collection) {
        throw new Error('Collection not initialized. Call createdWithCollection before update.');
    }
    const newvalues = { $set: object };
    await collection.updateOne(filter, newvalues, { upsert });
};

const deleted = async (filter) => {
    if (!collection) {
        throw new Error('Collection not initialized. Call createdWithCollection before delete.');
    }
    await collection.deleteOne(filter);
};

export const MongoData = {
    connect,
    disConnect,
    createdWithCollection,
    get,
    insert,
    update,
    deleted
};
