'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Button from '@/components/common/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real application, you would send this to your backend API
      // For now, we'll just show a success message
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600">
            Have a project in mind? Let's discuss how we can help you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <a href="mailto:info@makezaa.com" className="text-blue-600 hover:text-blue-700">
                  info@makezaa.com
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-700">
                  +1 (234) 567-890
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                <p className="text-gray-700">
                  123 Business St<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Working Hours</h3>
                <p className="text-gray-700">
                  Monday - Friday<br />
                  9:00 AM - 5:00 PM EST
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
              <Textarea
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

