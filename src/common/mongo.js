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
        return;
    }
    try {
        client = await MongoClient.connect(connectString, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db(dbName);
    } catch (error) {
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
        }
    } catch (error) {
        throw error;
    }
};

const createdWithCollection = async (collectionName) => {
    if (!db) {
        throw new Error('Database not initialized. Call connect before createdWithCollection.');
    }
    if (!collection || collection.collectionName !== collectionName) {
        collection = db.collection(collectionName);
    }
};

const get = async (query = {}) => {
    if (!collection) {
        throw new Error('Collection not initialized. Call createdWithCollection before get.');
    }
    try {
        return await collection.find(query).toArray();
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
        throw error;
    }
};

const deleted = async (filter) => {
    if (!collection) {
        throw new Error('Collection not initialized. Call createdWithCollection before delete.');
    }
    try {
        await collection.deleteOne(filter);
    } catch (error) {
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
