import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
    maxPoolSize: 10,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve the client across module reloads
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, create a new client
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

// Database helper function
export async function getDb() {
    const client = await clientPromise;
    return client.db(process.env.MONGODB_DB || 'makezaa_agency');
}

// Collection helpers
export async function getCollection(collectionName) {
    const db = await getDb();
    return db.collection(collectionName);
}

export default clientPromise;
