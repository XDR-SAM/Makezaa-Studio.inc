'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminBlogsPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        imageUrl: '',
    });
    const [uploadingImage, setUploadingImage] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-blogs'],
        queryFn: async () => {
            const res = await fetch('/api/blog?limit=100');
            if (!res.ok) throw new Error('Failed to fetch blogs');
            return res.json();
        },
    });

    const createMutation = useMutation({
        mutationFn: async (blogData) => {
            const res = await fetch('/api/blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blogData),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create blog');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-blogs']);
            toast.success('Blog created successfully!');
            resetForm();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ slug, data }) => {
            const res = await fetch(`/api/blog/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update blog');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-blogs']);
            toast.success('Blog updated successfully!');
            resetForm();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (slug) => {
            const res = await fetch(`/api/blog/${slug}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete blog');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-blogs']);
            toast.success('Blog deleted successfully!');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to upload image');

            const data = await res.json();
            setFormData((prev) => ({ ...prev, imageUrl: data.url }));
            toast.success('Image uploaded successfully!');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingBlog) {
            updateMutation.mutate({ slug: editingBlog.slug, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title,
            content: blog.content,
            category: blog.category,
            imageUrl: blog.imageUrl || '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = (slug) => {
        if (confirm('Are you sure you want to delete this blog?')) {
            deleteMutation.mutate(slug);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', content: '', category: '', imageUrl: '' });
        setEditingBlog(null);
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Manage Blogs</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary"
                >
                    Create New Blog
                </button>
            </div>

            {isLoading ? (
                <LoadingSpinner size="lg" />
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Created</th>
                                <th>Views</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data?.map((blog) => (
                                <tr key={blog._id}>
                                    <td>{blog.title}</td>
                                    <td>
                                        <span className="badge badge-primary">{blog.category}</span>
                                    </td>
                                    <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                                    <td>{blog.views || 0}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(blog)}
                                                className="btn btn-sm btn-ghost"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog.slug)}
                                                className="btn btn-sm btn-error"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-lg mb-4">
                            {editingBlog ? 'Edit Blog' : 'Create New Blog'}
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
                                <select
                                    className="select select-bordered"
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value })
                                    }
                                    required
                                >
                                    <option value="">Select category</option>
                                    <option value="SEO">SEO</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Web Development">Web Development</option>
                                    <option value="Design">Design</option>
                                </select>
                            </div>

                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Content</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-32"
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData({ ...formData, content: e.target.value })
                                    }
                                    required
                                ></textarea>
                            </div>

                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Image</span>
                                </label>
                                <input
                                    type="file"
                                    className="file-input file-input-bordered"
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                />
                                {uploadingImage && <span className="text-sm">Uploading...</span>}
                                {formData.imageUrl && (
                                    <img
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        className="mt-2 w-32 h-32 object-cover rounded"
                                    />
                                )}
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                >
                                    {editingBlog ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
