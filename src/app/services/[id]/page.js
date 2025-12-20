'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Spinner from '@/components/common/Spinner';

export default function ServiceDetailPage() {
  const params = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  const fetchService = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/services/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setService(data);
      }
    } catch (error) {
      console.error('Error fetching service:', error);
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

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600">The service you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {service.imageUrl && (
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={service.imageUrl}
              alt={service.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-600 text-sm font-semibold rounded-full">
              {service.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{service.title}</h1>

          <div className="prose max-w-none mb-6">
            <p className="text-lg text-gray-700 whitespace-pre-line">
              {service.description}
            </p>
          </div>

          {service.features && service.features.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
              <ul className="space-y-3">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 pt-8 border-t">
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </a>
          </div>

          <div className="text-sm text-gray-500 mt-8">
            <p>Published: {new Date(service.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

