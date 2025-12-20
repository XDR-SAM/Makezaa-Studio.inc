'use client';

import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

export default function ServicesPage() {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const res = await fetch('/api/services');
            if (!res.ok) throw new Error('Failed to fetch services');
            return res.json();
        },
    });

    if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4">Our Services</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Comprehensive digital solutions tailored to your business needs
                </p>
            </div>

            {isLoading ? (
                <LoadingSpinner size="lg" fullScreen />
            ) : data?.data && data.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.data.map((service) => (
                        <div key={service._id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-primary text-2xl">{service.title}</h2>
                                <p className="text-gray-600 mb-4">{service.description}</p>

                                {service.features && service.features.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-2">Key Features:</h3>
                                        <ul className="space-y-2">
                                            {service.features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <svg
                                                        className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                    <span className="text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No services available</p>
                </div>
            )}
        </div>
    );
}
