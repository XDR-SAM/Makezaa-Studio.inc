import clientPromise from '../lib/db';

const DB_NAME = 'makezaa';
const COLLECTION_NAME = 'services';

export async function createService(data) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const service = {
    title: data.title,
    description: data.description,
    icon: data.icon || '',
    imageUrl: data.imageUrl || '',
    category: data.category || 'Web Development',
    features: data.features || [],
    createdByEmail: data.createdByEmail,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(service);
  return { ...service, _id: result.insertedId };
}

export async function getServices(filters = {}) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const query = {};
  
  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
    ];
  }

  const services = await collection.find(query).sort({ createdAt: -1 }).toArray();
  return services;
}

export async function getServiceById(id) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const { ObjectId } = await import('mongodb');
  return await collection.findOne({ _id: new ObjectId(id) });
}

export async function updateService(id, data) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const { ObjectId } = await import('mongodb');
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  );

  return result;
}

export async function deleteService(id) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const { ObjectId } = await import('mongodb');
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result;
}

