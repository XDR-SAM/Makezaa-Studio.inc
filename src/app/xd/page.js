'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminDashboard() {
    const { data: blogsData } = useQuery({
        queryKey: ['admin-blogs-count'],
        queryFn: async () => {
            const res = await fetch('/api/blog?limit=1');
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        },
    });

    const { data: projectsData } = useQuery({
        queryKey: ['admin-projects-count'],
        queryFn: async () => {
            const res = await fetch('/api/projects?limit=1');
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        },
    });

    const { data: servicesData } = useQuery({
        queryKey: ['admin-services-count'],
        queryFn: async () => {
            const res = await fetch('/api/services');
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        },
    });

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="stat-title">Total Blogs</div>
                        <div className="stat-value text-primary">
                            {blogsData?.pagination?.total || 0}
                        </div>
                        <div className="stat-actions">
                            <Link href="/xd/blogs" className="btn btn-sm btn-primary">
                                Manage
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="stat-title">Total Projects</div>
                        <div className="stat-value text-secondary">
                            {projectsData?.pagination?.total || 0}
                        </div>
                        <div className="stat-actions">
                            <Link href="/xd/projects" className="btn btn-sm btn-secondary">
                                Manage
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-accent">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div className="stat-title">Total Services</div>
                        <div className="stat-value text-accent">
                            {servicesData?.data?.length || 0}
                        </div>
                        <div className="stat-actions">
                            <Link href="/xd/services" className="btn btn-sm btn-accent">
                                Manage
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <Link href="/xd/blogs" className="btn btn-outline">
                            Create New Blog
                        </Link>
                        <Link href="/xd/projects" className="btn btn-outline">
                            Add New Project
                        </Link>
                        <Link href="/xd/services" className="btn btn-outline">
                            Add New Service
                        </Link>
                        <Link href="/xd/testimonials" className="btn btn-outline">
                            Add Testimonial
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
