import { Schema, model, models } from 'mongoose';

const BlogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  createdByEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Blog = models.Blog || model('Blog', BlogSchema);

export default Blog;
