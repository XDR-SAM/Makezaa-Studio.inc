'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';

export default function BlogEditPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (params.slug && params.slug !== 'new') {
      fetchBlog();
    } else {
      setLoading(false);
    }
  }, [params.slug]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blog/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title || '',
          content: data.content || '',
          category: data.category || '',
          imageUrl: data.imageUrl || '',
        });
      }
    } catch (error) {
      toast.error('Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, imageUrl: data.imageUrl });
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = params.slug === 'new' ? '/api/blog' : `/api/blog/${params.slug}`;
      const method = params.slug === 'new' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(params.slug === 'new' ? 'Blog created successfully' : 'Blog updated successfully');
        router.push('/xd/blogs');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save blog');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {params.slug === 'new' ? 'Create New Blog' : 'Edit Blog'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          >
            <option value="">Select a category</option>
            <option value="SEO">SEO</option>
            <option value="Marketing">Marketing</option>
            <option value="Web Development">Web Development</option>
            <option value="General">General</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          {formData.imageUrl && (
            <div className="mt-2">
              <img src={formData.imageUrl} alt="Preview" className="h-32 w-auto rounded" />
            </div>
          )}
        </div>

        <Textarea
          label="Content (Markdown supported)"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={15}
          required
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/xd/blogs')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : params.slug === 'new' ? 'Create Blog' : 'Update Blog'}
          </Button>
        </div>
      </form>
    </div>
  );
}

