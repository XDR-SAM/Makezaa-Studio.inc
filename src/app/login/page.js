'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            toast.success('Login successful!');
            router.push('/xd');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-2xl">
                <div className="card-body">
                    <h2 className="card-title text-3xl font-bold text-center justify-center mb-6">
                        Admin Login
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="admin@example.com"
                                className="input input-bordered"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="input input-bordered"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="form-control">
                            <button
                                type="submit"
                                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
