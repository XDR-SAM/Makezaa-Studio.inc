import clientPromise from '../lib/db';
import slugify from 'slugify';

const DB_NAME = 'makezaa';
const COLLECTION_NAME = 'projects';

export async function createProject(data) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const slug = slugify(data.title, { lower: true, strict: true });
  
  const project = {
    title: data.title,
    slug,
    description: data.description,
    client: data.client || '',
    category: data.category || 'Web Development',
    imageUrl: data.imageUrl || '',
    testimonial: data.testimonial || '',
    rating: data.rating || 5,
    createdByEmail: data.createdByEmail,
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 0,
  };

  const result = await collection.insertOne(project);
  return { ...project, _id: result.insertedId };
}

export async function getProjects(filters = {}) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const query = {};
  
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
      { category: { $regex: filters.search, $options: 'i' } },
      { client: { $regex: filters.search, $options: 'i' } },
    ];
  }

  if (filters.category) {
    query.category = filters.category;
  }

  const sort = {};
  if (filters.sortBy === 'date') {
    sort.createdAt = filters.sortOrder === 'asc' ? 1 : -1;
  } else if (filters.sortBy === 'popularity') {
    sort.views = filters.sortOrder === 'asc' ? 1 : -1;
  } else {
    sort.createdAt = -1; // Default: newest first
  }

  const skip = (filters.page - 1) * (filters.limit || 10);
  const limit = filters.limit || 10;

  const projects = await collection
    .find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await collection.countDocuments(query);

  return { projects, total, page: filters.page || 1, limit: limit };
}

export async function getProjectBySlug(slug) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const project = await collection.findOne({ slug });
  
  if (project) {
    // Increment views
    await collection.updateOne(
      { slug },
      { $inc: { views: 1 } }
    );
  }

  return project;
}

export async function updateProject(slug, data) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const updateData = {
    ...data,
    updatedAt: new Date(),
  };

  if (data.title) {
    updateData.slug = slugify(data.title, { lower: true, strict: true });
  }

  const result = await collection.updateOne(
    { slug },
    { $set: updateData }
  );

  return result;
}

export async function deleteProject(slug) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const result = await collection.deleteOne({ slug });
  return result;
}

export async function getProjectById(id) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const { ObjectId } = await import('mongodb');
  return await collection.findOne({ _id: new ObjectId(id) });
}

