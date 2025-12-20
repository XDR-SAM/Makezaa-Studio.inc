'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function HomePage() {
  // Fetch services
  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error('Failed to fetch services');
      return res.json();
    },
  });

  // Fetch featured projects
  const { data: projectsData } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: async () => {
      const res = await fetch('/api/projects?limit=3');
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    },
  });

  // Fetch latest blogs
  const { data: blogsData } = useQuery({
    queryKey: ['blogs', 'latest'],
    queryFn: async () => {
      const res = await fetch('/api/blog?limit=3');
      if (!res.ok) throw new Error('Failed to fetch blogs');
      return res.json();
    },
  });

  // Fetch testimonials
  const { data: testimonialsData } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const res = await fetch('/api/testimonials');
      if (!res.ok) throw new Error('Failed to fetch testimonials');
      return res.json();
    },
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary min-h-[600px] flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              Transform Your Digital Presence
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-gray-100"
            >
              Professional web development, SEO optimization, and digital marketing
              solutions for businesses worldwide
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <Link href="/contact" className="btn btn-lg bg-white text-primary hover:bg-gray-100">
                Get Started
              </Link>
              <Link href="/projects" className="btn btn-lg btn-outline text-white border-white hover:bg-white hover:text-primary">
                View Our Work
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive digital solutions to help your business grow
            </p>
          </div>

          {servicesData?.data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesData.data.slice(0, 6).map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="card bg-base-100 shadow-xl h-full">
                    <div className="card-body">
                      <h3 className="card-title text-primary">{service.title}</h3>
                      <p className="text-gray-600">{service.description}</p>
                      {service.features && service.features.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {service.features.slice(0, 3).map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <LoadingSpinner size="lg" />
          )}

          <div className="text-center mt-12">
            <Link href="/services" className="btn btn-primary btn-lg">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out some of our recent work
            </p>
          </div>

          {projectsData?.data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projectsData.data.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    title={project.title}
                    description={project.description}
                    imageUrl={project.imageUrl}
                    href={`/projects/${project.slug}`}
                    category={project.category}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <LoadingSpinner size="lg" />
          )}

          <div className="text-center mt-12">
            <Link href="/projects" className="btn btn-primary btn-lg">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonialsData?.data && testimonialsData.data.length > 0 && (
        <section className="py-20 bg-base-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonialsData.data.slice(0, 3).map((testimonial, index) => (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card bg-base-100 shadow-xl"
                >
                  <div className="card-body">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">{testimonial.content}</p>
                    <div className="mt-auto">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">
                        {testimonial.position} {testimonial.company && `at ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Blog Posts Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Latest Insights</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest trends and tips
            </p>
          </div>

          {blogsData?.data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogsData.data.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    title={blog.title}
                    description={blog.content.substring(0, 150) + '...'}
                    imageUrl={blog.imageUrl}
                    href={`/blog/${blog.slug}`}
                    category={blog.category}
                    date={blog.createdAt}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <LoadingSpinner size="lg" />
          )}

          <div className="text-center mt-12">
            <Link href="/blog" className="btn btn-primary btn-lg">
              Read More Articles
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's work together to bring your digital vision to life
          </p>
          <Link href="/contact" className="btn btn-lg bg-white text-primary hover:bg-gray-100">
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
}
