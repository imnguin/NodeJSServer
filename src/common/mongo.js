import mongodb from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

var connectString = process.env.MONGO_URI ?? "";
var dbName = process.env.DBNAME_MONGO ?? "";
var MongoClient = mongodb.MongoClient;
var client;
var db;
var collection;

const connect = async () => {
    try {
        client = await MongoClient.connect(connectString);
        db = client.db(dbName);
    } catch (error) {
        throw error;
    }
};

const disConnect = async () => {
    try {
        await client.close();
    } catch (error) {
        throw error;
    }
}

const createdWithCollection = async (collectionName) => {
    collection = await db.collection(collectionName);
}

const get = async (query = {}) => {
    return await collection.find(query).toArray();
}

const insert = async (object) => {
    if(object instanceof Array)
    {
        await collection.insertMany(object);
    }
    else
    {
        await collection.insertOne(object);
    }
}

const update = async (object, filter, upsert = true) => {
    const newvalues = {$set: object}
    await collection.updateOne(filter, newvalues, upsert);
}

const deleted = async (filter) => {
    await collection.deleteOne(filter);
}

export const MongoData = {
    connect,
    disConnect,
    createdWithCollection,
    get,
    insert,
    update,
    deleted
};