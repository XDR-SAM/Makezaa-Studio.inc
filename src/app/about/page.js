export const metadata = {
    title: 'About Us | Makezaa',
    description: 'Learn more about Makezaa - your trusted partner for web development, SEO, and digital marketing solutions.',
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold mb-8 text-center">About Makezaa</h1>

                <div className="prose prose-lg max-w-none">
                    <p className="text-xl text-gray-600 mb-8 text-center">
                        We are a professional digital agency specializing in web development,
                        SEO optimization, and digital marketing solutions.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-primary">Our Mission</h2>
                                <p>
                                    To empower businesses with cutting-edge digital solutions that
                                    drive growth and success in the modern marketplace.
                                </p>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-primary">Our Vision</h2>
                                <p>
                                    To be the leading digital agency trusted by businesses across
                                    the US, Canada, and EU for innovative and results-driven solutions.
                                </p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="text-center">
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
                            <p className="text-gray-600">
                                We deliver projects on time without compromising quality
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="text-4xl mb-4">💡</div>
                            <h3 className="font-semibold text-lg mb-2">Expert Team</h3>
                            <p className="text-gray-600">
                                Our team consists of experienced professionals in their fields
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="text-4xl mb-4">🎯</div>
                            <h3 className="font-semibold text-lg mb-2">Results-Driven</h3>
                            <p className="text-gray-600">
                                We focus on delivering measurable results for your business
                            </p>
                        </div>
                    </div>

                    <div className="bg-primary text-white p-8 rounded-lg text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Work With Us?</h2>
                        <p className="mb-6">
                            Let's discuss how we can help your business grow
                        </p>
                        <a href="/contact" className="btn btn-lg bg-white text-primary hover:bg-gray-100">
                            Get in Touch
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
