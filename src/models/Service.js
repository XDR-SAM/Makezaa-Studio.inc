import { Schema, model, models } from 'mongoose';

const ServiceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  category: { type: String, required: true },
  features: [{ type: String }],
  createdByEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Service = models.Service || model('Service', ServiceSchema);

export default Service;
