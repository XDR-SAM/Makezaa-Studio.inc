import clientPromise from '../lib/db';
import slugify from 'slugify';

const DB_NAME = 'makezaa';
const COLLECTION_NAME = 'blogs';

export async function createBlog(data) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const slug = slugify(data.title, { lower: true, strict: true });
  
  const blog = {
    title: data.title,
    slug,
    content: data.content,
    category: data.category || 'General',
    imageUrl: data.imageUrl || '',
    createdByEmail: data.createdByEmail,
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 0,
  };

  const result = await collection.insertOne(blog);
  return { ...blog, _id: result.insertedId };
}

export async function getBlogs(filters = {}) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const query = {};
  
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { content: { $regex: filters.search, $options: 'i' } },
      { category: { $regex: filters.search, $options: 'i' } },
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

  const blogs = await collection
    .find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await collection.countDocuments(query);

  return { blogs, total, page: filters.page || 1, limit: limit };
}

export async function getBlogBySlug(slug) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const blog = await collection.findOne({ slug });
  
  if (blog) {
    // Increment views
    await collection.updateOne(
      { slug },
      { $inc: { views: 1 } }
    );
  }

  return blog;
}

export async function updateBlog(slug, data) {
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

export async function deleteBlog(slug) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const result = await collection.deleteOne({ slug });
  return result;
}

export async function getBlogById(id) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  const { ObjectId } = await import('mongodb');
  return await collection.findOne({ _id: new ObjectId(id) });
}

