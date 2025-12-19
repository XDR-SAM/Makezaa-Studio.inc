'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Spinner from '@/components/common/Spinner';

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchProject();
    }
  }, [params.slug]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
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

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {project.imageUrl && (
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-semibold rounded-full">
              {project.category}
            </span>
            {project.rating && (
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="text-gray-600">{project.rating}/5</span>
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>

          {project.client && (
            <p className="text-gray-600 mb-4">
              <span className="font-semibold">Client:</span> {project.client}
            </p>
          )}

          <div className="prose max-w-none mb-6">
            <p className="text-lg text-gray-700 whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {project.testimonial && (
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
              <p className="text-gray-700 italic">"{project.testimonial}"</p>
            </div>
          )}

          <div className="text-sm text-gray-500 mt-8">
            <p>Published: {new Date(project.createdAt).toLocaleDateString()}</p>
            {project.views && <p>Views: {project.views}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

