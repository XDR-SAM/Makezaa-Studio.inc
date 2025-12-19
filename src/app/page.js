'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ServiceCard from '@/components/modules/ServiceCard';
import ProjectCard from '@/components/modules/ProjectCard';
import BlogCard from '@/components/modules/BlogCard';
import Spinner from '@/components/common/Spinner';

export default function Home() {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, projectsRes, blogsRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/projects?limit=3'),
        fetch('/api/blog?limit=4'),
      ]);

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData);
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.projects || []);
      }

      if (blogsRes.ok) {
        const blogsData = await blogsRes.json();
        setBlogs(blogsData.blogs || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transform Your Digital Presence
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Professional web development, SEO optimization, and digital marketing solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Our Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive digital solutions to help your business grow
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No services available yet. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/services"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Showcasing our best work for clients across the globe
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No projects available yet. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/projects"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Projects →
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Teaser Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Insights
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest trends in web development, SEO, and digital marketing
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No blog posts available yet. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/blog"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Read More Articles →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
