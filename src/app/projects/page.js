'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

export default function ProjectsPage() {
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['projects', category, page],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '12',
            });
            if (category) params.append('category', category);

            const res = await fetch(`/api/projects?${params}`);
            if (!res.ok) throw new Error('Failed to fetch projects');
            return res.json();
        },
    });

    if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4">Our Projects</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Explore our portfolio of successful projects
                </p>
            </div>

            {/* Filter */}
            <div className="mb-8 flex justify-center">
                <select
                    className="select select-bordered w-full md:w-64"
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Categories</option>
                    <option value="Web Development">Web Development</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="SEO">SEO</option>
                </select>
            </div>

            {/* Projects Grid */}
            {isLoading ? (
                <LoadingSpinner size="lg" fullScreen />
            ) : data?.data && data.data.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.data.map((project) => (
                            <Card
                                key={project._id}
                                title={project.title}
                                description={project.description}
                                imageUrl={project.imageUrl}
                                href={`/projects/${project.slug}`}
                                category={project.category}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {data.pagination && data.pagination.pages > 1 && (
                        <div className="flex justify-center gap-2 mt-12">
                            <button
                                className="btn btn-outline"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </button>
                            <span className="btn btn-ghost">
                                Page {page} of {data.pagination.pages}
                            </span>
                            <button
                                className="btn btn-outline"
                                disabled={page === data.pagination.pages}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No projects found</p>
                </div>
            )}
        </div>
    );
}
