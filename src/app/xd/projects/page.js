'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminProjectsPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        client: '',
        imageUrl: '',
        technologies: '',
    });
    const [uploadingImage, setUploadingImage] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-projects'],
        queryFn: async () => {
            const res = await fetch('/api/projects?limit=100');
            if (!res.ok) throw new Error('Failed to fetch projects');
            return res.json();
        },
    });

    const createMutation = useMutation({
        mutationFn: async (projectData) => {
            const dataToSend = {
                ...projectData,
                technologies: projectData.technologies
                    ? projectData.technologies.split(',').map((t) => t.trim())
                    : [],
            };
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create project');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-projects']);
            toast.success('Project created successfully!');
            resetForm();
        },
        onError: (error) => toast.error(error.message),
    });

    const updateMutation = useMutation({
        mutationFn: async ({ slug, data }) => {
            const dataToSend = {
                ...data,
                technologies: data.technologies
                    ? data.technologies.split(',').map((t) => t.trim())
                    : [],
            };
            const res = await fetch(`/api/projects/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });
            if (!res.ok) throw new Error('Failed to update project');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-projects']);
            toast.success('Project updated successfully!');
            resetForm();
        },
        onError: (error) => toast.error(error.message),
    });

    const deleteMutation = useMutation({
        mutationFn: async (slug) => {
            const res = await fetch(`/api/projects/${slug}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete project');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-projects']);
            toast.success('Project deleted successfully!');
        },
        onError: (error) => toast.error(error.message),
    });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
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
        if (editingProject) {
            updateMutation.mutate({ slug: editingProject.slug, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            category: project.category,
            client: project.client || '',
            imageUrl: project.imageUrl || '',
            technologies: project.technologies ? project.technologies.join(', ') : '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = (slug) => {
        if (confirm('Are you sure you want to delete this project?')) {
            deleteMutation.mutate(slug);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: '',
            client: '',
            imageUrl: '',
            technologies: '',
        });
        setEditingProject(null);
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Manage Projects</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                    Create New Project
                </button>
            </div>

            {isLoading ? (
                <LoadingSpinner size="lg" />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.data?.map((project) => (
                        <div key={project._id} className="card bg-base-100 shadow-xl">
                            {project.imageUrl && (
                                <figure className="h-48">
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                </figure>
                            )}
                            <div className="card-body">
                                <h2 className="card-title">{project.title}</h2>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {project.description}
                                </p>
                                <div className="badge badge-primary">{project.category}</div>
                                <div className="card-actions justify-end mt-4">
                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="btn btn-sm btn-ghost"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.slug)}
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
                            {editingProject ? 'Edit Project' : 'Create New Project'}
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
                                    <option value="Web Development">Web Development</option>
                                    <option value="E-commerce">E-commerce</option>
                                    <option value="Mobile App">Mobile App</option>
                                    <option value="SEO">SEO</option>
                                </select>
                            </div>

                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Client</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={formData.client}
                                    onChange={(e) =>
                                        setFormData({ ...formData, client: e.target.value })
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
                                    <span className="label-text">Technologies (comma-separated)</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    placeholder="React, Node.js, MongoDB"
                                    value={formData.technologies}
                                    onChange={(e) =>
                                        setFormData({ ...formData, technologies: e.target.value })
                                    }
                                />
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
                                <button type="button" onClick={resetForm} className="btn btn-ghost">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                >
                                    {editingProject ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
