'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminServicesPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        features: '',
        order: 0,
    });

    const { data, isLoading } = useQuery({
        queryKey: ['admin-services'],
        queryFn: async () => {
            const res = await fetch('/api/services');
            if (!res.ok) throw new Error('Failed to fetch services');
            return res.json();
        },
    });

    const createMutation = useMutation({
        mutationFn: async (serviceData) => {
            const dataToSend = {
                ...serviceData,
                features: serviceData.features
                    ? serviceData.features.split('\n').filter((f) => f.trim())
                    : [],
            };
            const res = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create service');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-services']);
            toast.success('Service created successfully!');
            resetForm();
        },
        onError: (error) => toast.error(error.message),
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            const dataToSend = {
                ...data,
                id,
                features: data.features
                    ? data.features.split('\n').filter((f) => f.trim())
                    : [],
            };
            const res = await fetch('/api/services', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });
            if (!res.ok) throw new Error('Failed to update service');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-services']);
            toast.success('Service updated successfully!');
            resetForm();
        },
        onError: (error) => toast.error(error.message),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete service');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-services']);
            toast.success('Service deleted successfully!');
        },
        onError: (error) => toast.error(error.message),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingService) {
            updateMutation.mutate({ id: editingService._id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            title: service.title,
            description: service.description,
            category: service.category || '',
            features: service.features ? service.features.join('\n') : '',
            order: service.order || 0,
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this service?')) {
            deleteMutation.mutate(id);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: '',
            features: '',
            order: 0,
        });
        setEditingService(null);
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Manage Services</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                    Create New Service
                </button>
            </div>

            {isLoading ? (
                <LoadingSpinner size="lg" />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.data?.map((service) => (
                        <div key={service._id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">{service.title}</h2>
                                <p className="text-sm text-gray-600">{service.description}</p>
                                {service.category && (
                                    <div className="badge badge-primary">{service.category}</div>
                                )}
                                <div className="card-actions justify-end mt-4">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="btn btn-sm btn-ghost"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service._id)}
                                        className="btn btn-sm btn-error"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-lg mb-4">
                            {editingService ? 'Edit Service' : 'Create New Service'}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Title</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Category</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    placeholder="e.g., Development, Marketing"
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value })
                                    }
                                />
                            </div>

                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-24"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    required
                                ></textarea>
                            </div>

                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Features (one per line)</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-32"
                                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                                    value={formData.features}
                                    onChange={(e) =>
                                        setFormData({ ...formData, features: e.target.value })
                                    }
                                ></textarea>
                            </div>

                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Display Order</span>
                                </label>
                                <input
                                    type="number"
                                    className="input input-bordered"
                                    value={formData.order}
                                    onChange={(e) =>
                                        setFormData({ ...formData, order: parseInt(e.target.value) })
                                    }
                                />
                            </div>

                            <div className="modal-action">
                                <button type="button" onClick={resetForm} className="btn btn-ghost">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                >
                                    {editingService ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
