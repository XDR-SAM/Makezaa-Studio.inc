'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const categories = ['all', 'Web Development', 'SEO', 'Digital Marketing', 'Design'];

  useEffect(() => {
    fetchServices();
  }, [searchTerm, categoryFilter, currentPage]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 9,
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
      });

      const response = await fetch(`/api/services?${params}`);
      const data = await response.json();

      if (response.ok) {
        setServices(data.services || []);
        setPagination(data.pagination || {});
      } else {
        toast.error('Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive digital solutions tailored to help your business thrive in the modern marketplace.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 bg-white p-6 rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Services
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by title or description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Services Grid */}
            {services.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              >
                {services.map((service, index) => (
                  <motion.div
                    key={service._id}
                    variants={itemVariants}
                    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                      {service.icon ? (
                        <img src={service.icon} alt={service.title} className="w-10 h-10" />
                      ) : (
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                    </div>
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full uppercase tracking-wide">
                        {service.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {service.description}
                    </p>
                    {service.features && service.features.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Features:</h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Learn More
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-500">
                  {searchTerm || categoryFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Services will be available soon'}
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center items-center space-x-2"
              >
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {currentPage} of {pagination.pages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                  disabled={currentPage === pagination.pages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
