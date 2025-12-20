'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminTestimonialsPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        position: '',
        content: '',
        rating: 5,
        imageUrl: '',
    });

    const { data, isLoading } = useQuery({
        queryKey: ['admin-testimonials'],
        queryFn: async () => {
            const res = await fetch('/api/testimonials');
            if (!res.ok) throw new Error('Failed to fetch testimonials');
            return res.json();
        },
    });

    const createMutation = useMutation({
        mutationFn: async (testimonialData) => {
            const res = await fetch('/api/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testimonialData),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create testimonial');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-testimonials']);
            toast.success('Testimonial created successfully!');
            resetForm();
        },
        onError: (error) => toast.error(error.message),
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            const res = await fetch('/api/testimonials', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...data }),
            });
            if (!res.ok) throw new Error('Failed to update testimonial');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-testimonials']);
            toast.success('Testimonial updated successfully!');
            resetForm();
        },
        onError: (error) => toast.error(error.message),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete testimonial');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-testimonials']);
            toast.success('Testimonial deleted successfully!');
        },
        onError: (error) => toast.error(error.message),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingTestimonial) {
            updateMutation.mutate({ id: editingTestimonial._id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleEdit = (testimonial) => {
        setEditingTestimonial(testimonial);
        setFormData({
            name: testimonial.name,
            company: testimonial.company || '',
            position: testimonial.position || '',
            content: testimonial.content,
            rating: testimonial.rating,
            imageUrl: testimonial.imageUrl || '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            deleteMutation.mutate(id);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            company: '',
            position: '',
            content: '',
            rating: 5,
            imageUrl: '',
        });
        setEditingTestimonial(null);
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Manage Testimonials</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                    Create New Testimonial
                </button>
            </div>

            {isLoading ? (
                <LoadingSpinner size="lg" />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.data?.map((testimonial) => (
                        <div key={testimonial._id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-3">{testimonial.content}</p>
                                <div className="mt-4">
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {testimonial.position} {testimonial.company && `at ${testimonial.company}`}
                                    </p>
                                </div>
                                <div className="card-actions justify-end mt-4">
                                    <button
                                        onClick={() => handleEdit(testimonial)}
                                        className="btn btn-sm btn-ghost"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(testimonial._id)}
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
                            {editingTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Company</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered"
                                        value={formData.company}
                                        onChange={(e) =>
                                            setFormData({ ...formData, company: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Position</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered"
                                        value={formData.position}
                                        onChange={(e) =>
                                            setFormData({ ...formData, position: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Content</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-24"
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData({ ...formData, content: e.target.value })
                                    }
                                    required
                                ></textarea>
                            </div>

                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Rating</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={formData.rating}
                                    onChange={(e) =>
                                        setFormData({ ...formData, rating: parseInt(e.target.value) })
                                    }
                                >
                                    <option value={5}>5 Stars</option>
                                    <option value={4}>4 Stars</option>
                                    <option value={3}>3 Stars</option>
                                    <option value={2}>2 Stars</option>
                                    <option value={1}>1 Star</option>
                                </select>
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
                                    {editingTestimonial ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
