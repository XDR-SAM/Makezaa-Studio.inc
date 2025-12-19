'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function EditProject() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    client: '',
    rating: 5,
    testimonial: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const router = useRouter();
  const params = useParams();

  const categories = ['Web Development', 'Mobile App', 'E-commerce', 'Design', 'Marketing'];

  useEffect(() => {
    checkAuth();
    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const checkAuth = () => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      router.push('/login');
      return;
    }
  };

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setFormData({
          title: data.title,
          description: data.description,
          category: data.category,
          client: data.client,
          rating: data.rating || 5,
          testimonial: data.testimonial || '',
          imageUrl: data.imageUrl || ''
        });
      } else {
        toast.error('Failed to fetch project');
        router.push('/xd/projects');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('An error occurred');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          imageUrl: data.url
        }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Project updated successfully!');
        router.push('/xd/projects');
      } else {
        toast.error(data.error || 'Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/xd/projects" className="text-blue-600 hover:text-blue-700">
                ← Back to Projects
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  id="client"
                  name="client"
                  required
                  value={formData.client}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter client name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <select
                  id="rating"
                  name="rating"
                  required
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Project Image
              </label>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="imageUrl"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="imageUrl"
                    className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-gray-600">
                        {imageUploading ? 'Uploading...' : 'Change Image'}
                      </span>
                    </div>
                  </label>
                  {imageUploading && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  )}
                </div>

                {formData.imageUrl && (
                  <div className="relative">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe project, challenges, and solutions..."
              />
            </div>

            <div>
              <label htmlFor="testimonial" className="block text-sm font-medium text-gray-700 mb-2">
                Client Testimonial
              </label>
              <textarea
                id="testimonial"
                name="testimonial"
                rows={4}
                value={formData.testimonial}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="What did the client say about this project?"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link
                href="/xd/projects"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || imageUploading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  'Update Project'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
