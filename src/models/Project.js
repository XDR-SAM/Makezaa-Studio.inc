import { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  client: { type: String, required: true },
  imageUrl: { type: String },
  category: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  testimonial: { type: String },
  createdByEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Project = models.Project || model('Project', ProjectSchema);

export default Project;
