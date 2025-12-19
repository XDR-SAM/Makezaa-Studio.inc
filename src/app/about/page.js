export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Makezaa
          </h1>
          <p className="text-xl text-gray-600">
            Your trusted partner in digital transformation
          </p>
        </div>

        <div className="prose max-w-none space-y-8">
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
            <p className="text-gray-700 leading-relaxed">
              Makezaa is a professional digital agency specializing in web development, 
              SEO optimization, and digital marketing solutions. We serve clients across 
              the United States, Canada, and the European Union, helping businesses 
              establish and grow their online presence.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to empower businesses with cutting-edge digital solutions 
              that drive growth, enhance visibility, and deliver measurable results. 
              We combine technical expertise with creative innovation to help our clients 
              succeed in the digital landscape.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Web Development:</strong> Custom websites and web applications built with modern technologies</li>
              <li><strong>SEO Optimization:</strong> Improve your search engine rankings and organic visibility</li>
              <li><strong>Digital Marketing:</strong> Comprehensive marketing strategies to reach your target audience</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Expert Team</h3>
                <p className="text-gray-700 text-sm">
                  Our team consists of experienced developers, SEO specialists, and marketing experts.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Proven Results</h3>
                <p className="text-gray-700 text-sm">
                  We deliver measurable results that help businesses grow and succeed.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Client-Focused</h3>
                <p className="text-gray-700 text-sm">
                  Your success is our priority. We work closely with you to achieve your goals.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Global Reach</h3>
                <p className="text-gray-700 text-sm">
                  Serving clients in the US, Canada, and EU with localized expertise.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

