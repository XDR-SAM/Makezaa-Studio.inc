'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import Spinner from '@/components/common/Spinner';

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchBlog();
    }
  }, [params.slug]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blog/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setBlog(data);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600">The blog post you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {blog.imageUrl && (
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full">
              {blog.category}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

          {blog.createdByEmail && (
            <p className="text-gray-600 mb-6">
              <span className="font-semibold">Author:</span> {blog.createdByEmail}
            </p>
          )}

          <div className="prose max-w-none">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>

          <div className="text-sm text-gray-500 mt-8 pt-8 border-t">
            <p>Published: {new Date(blog.createdAt).toLocaleDateString()}</p>
            {blog.views && <p>Views: {blog.views}</p>}
          </div>
        </div>
      </article>
    </div>
  );
}

