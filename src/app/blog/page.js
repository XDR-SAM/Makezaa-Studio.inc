'use client';

import { useEffect, useState } from 'react';
import BlogCard from '@/components/modules/BlogCard';
import Spinner from '@/components/common/Spinner';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchBlogs();
  }, [page, category, search, sortBy, sortOrder]);

  useEffect(() => {
    setPage(1);
    fetchBlogs(true);
  }, [category, search, sortBy, sortOrder]);

  const fetchBlogs = async (reset = false) => {
    if (reset) {
      setBlogs([]);
      setPage(1);
    }
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: reset ? '1' : page.toString(),
        limit: '12',
      });
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const response = await fetch(`/api/blog?${params}`);
      if (response.ok) {
        const data = await response.json();
        if (reset) {
          setBlogs(data.blogs || []);
        } else {
          setBlogs((prev) => [...prev, ...(data.blogs || [])]);
        }
        setHasMore(data.blogs?.length === 12);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const categories = [...new Set(blogs.map(b => b.category).filter(Boolean))];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Blog
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Insights, tips, and updates on web development, SEO, and digital marketing
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="date">Sort by Date</option>
            <option value="popularity">Sort by Popularity</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {/* Blogs Grid */}
        {loading && blogs.length === 0 ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No blog posts found. Try adjusting your search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

