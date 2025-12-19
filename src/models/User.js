import clientPromise from '../lib/db';
import { hashPassword } from '../lib/auth';

const DB_NAME = 'makezaa';
const COLLECTION_NAME = 'users';

export async function createUser(email, password) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  // Check if user already exists
  const existingUser = await collection.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = hashPassword(password);
  
  const user = {
    email,
    password: hashedPassword,
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(user);
  return { ...user, _id: result.insertedId, password: undefined };
}

export async function getUserByEmail(email) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  return await collection.findOne({ email });
}

export async function getUserById(id) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const { ObjectId } = await import('mongodb');
  return await collection.findOne({ _id: new ObjectId(id) });
}

