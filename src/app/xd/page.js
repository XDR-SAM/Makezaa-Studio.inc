'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Spinner from '@/components/common/Spinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogs: 0,
    projects: 0,
    services: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [blogsRes, projectsRes, servicesRes] = await Promise.all([
        fetch('/api/blog'),
        fetch('/api/projects'),
        fetch('/api/services'),
      ]);

      if (blogsRes.ok) {
        const blogsData = await blogsRes.json();
        setStats((prev) => ({ ...prev, blogs: blogsData.total || 0 }));
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setStats((prev) => ({ ...prev, projects: projectsData.total || 0 }));
      }

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setStats((prev) => ({ ...prev, services: servicesData.length || 0 }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Blogs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.blogs}</p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
          <Link href="/xd/blogs" className="text-blue-600 hover:text-blue-700 text-sm mt-4 inline-block">
            Manage Blogs →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.projects}</p>
            </div>
            <div className="text-4xl">💼</div>
          </div>
          <Link href="/xd/projects" className="text-blue-600 hover:text-blue-700 text-sm mt-4 inline-block">
            Manage Projects →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.services}</p>
            </div>
            <div className="text-4xl">⚙️</div>
          </div>
          <Link href="/xd/services" className="text-blue-600 hover:text-blue-700 text-sm mt-4 inline-block">
            Manage Services →
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/xd/blogs/new"
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center transition-colors"
          >
            Create New Blog
          </Link>
          <Link
            href="/xd/projects/new"
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center transition-colors"
          >
            Create New Project
          </Link>
          <Link
            href="/xd/services/new"
            className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center transition-colors"
          >
            Create New Service
          </Link>
        </div>
      </div>
    </div>
  );
}

