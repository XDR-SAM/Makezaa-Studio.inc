'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function BlogDetail() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params.slug) {
      fetchBlog();
      fetchRelatedBlogs();
    }
  }, [params.slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blogs/${params.slug}`);
      const data = await response.json();

      if (response.ok) {
        setBlog(data);
      } else {
        if (response.status === 404) {
          router.push('/blog');
          toast.error('Blog post not found');
        } else {
          toast.error('Failed to fetch blog post');
        }
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await fetch('/api/blogs?limit=3');
      const data = await response.json();

      if (response.ok) {
        setRelatedBlogs(data.blogs?.filter(b => b.slug !== params.slug) || []);
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog post not found</h1>
          <Link href="/blog" className="text-blue-600 hover:text-blue-700">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link href="/blog" className="text-gray-500 hover:text-gray-700">
                  Blog
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-900">{blog.title}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Blog Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Image */}
          {blog.imageUrl && (
            <div className="w-full h-64 md:h-96">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <div className="p-8 md:p-12">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full uppercase tracking-wide mb-4">
                {blog.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(blog.createdAt)}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatReadingTime(blog.content)}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {blog.createdByEmail}
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: blog.content }}
                className="text-gray-700 leading-relaxed"
              />
            </div>

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Share this article:</span>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-700 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <Link
                  href="/blog"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to Blog
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <motion.div
                  key={relatedBlog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {relatedBlog.imageUrl && (
                    <div className="h-32">
                      <img
                        src={relatedBlog.imageUrl}
                        alt={relatedBlog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full uppercase tracking-wide mb-3">
                      {relatedBlog.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {formatDate(relatedBlog.createdAt)}
                    </p>
                    <Link
                      href={`/blog/${relatedBlog.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                    >
                      Read More
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
