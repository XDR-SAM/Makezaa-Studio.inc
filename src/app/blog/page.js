'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

export default function BlogPage() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['blogs', search, category, page],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '9',
            });
            if (search) params.append('search', search);
            if (category) params.append('category', category);

            const res = await fetch(`/api/blog?${params}`);
            if (!res.ok) throw new Error('Failed to fetch blogs');
            return res.json();
        },
    });

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        refetch();
    };

    if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4">Our Blog</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Insights, tips, and trends in web development, SEO, and digital marketing
                </p>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        className="input input-bordered w-full md:w-80"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                        Search
                    </button>
                </form>

                <select
                    className="select select-bordered w-full md:w-auto"
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Categories</option>
                    <option value="SEO">SEO</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Design">Design</option>
                </select>
            </div>

            {/* Blog Grid */}
            {isLoading ? (
                <LoadingSpinner size="lg" fullScreen />
            ) : data?.data && data.data.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.data.map((blog) => (
                            <Card
                                key={blog._id}
                                title={blog.title}
                                description={blog.content.substring(0, 150) + '...'}
                                imageUrl={blog.imageUrl}
                                href={`/blog/${blog.slug}`}
                                category={blog.category}
                                date={blog.createdAt}
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
                    <p className="text-gray-600 text-lg">No blogs found</p>
                </div>
            )}
        </div>
    );
}
