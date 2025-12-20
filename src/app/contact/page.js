'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Have a project in mind? We'd love to hear from you. Send us a message
                        and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-4">Send us a Message</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Name *</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        className="input input-bordered"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Email *</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="input input-bordered"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">Subject</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        className="input input-bordered"
                                        value={formData.subject}
                                        onChange={(e) =>
                                            setFormData({ ...formData, subject: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="form-control mb-6">
                                    <label className="label">
                                        <span className="label-text">Message *</span>
                                    </label>
                                    <textarea
                                        placeholder="Your message"
                                        className="textarea textarea-bordered h-32"
                                        value={formData.message}
                                        onChange={(e) =>
                                            setFormData({ ...formData, message: e.target.value })
                                        }
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <div className="card bg-base-100 shadow-xl mb-6">
                            <div className="card-body">
                                <h3 className="card-title text-xl">Get in Touch</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <div>
                                            <p className="font-semibold">Email</p>
                                            <a href="mailto:info@makezaa.com" className="text-primary">
                                                info@makezaa.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <div>
                                            <p className="font-semibold">Phone</p>
                                            <a href="tel:+1234567890" className="text-primary">
                                                +1 (234) 567-890
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div>
                                            <p className="font-semibold">Address</p>
                                            <p className="text-gray-600">
                                                123 Business St<br />
                                                New York, NY 10001
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h3 className="card-title text-xl">Working Hours</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-semibold">Monday - Friday:</span> 9:00 AM - 6:00 PM EST</p>
                                    <p><span className="font-semibold">Saturday:</span> 10:00 AM - 4:00 PM EST</p>
                                    <p><span className="font-semibold">Sunday:</span> Closed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
