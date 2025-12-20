import Link from 'next/link';
import Image from 'next/image';

export default function ServiceCard({ service }) {
  return (
    <Link href={`/services/${service._id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
        {service.imageUrl && (
          <div className="relative h-32 w-full mb-4 rounded-lg overflow-hidden">
            <Image
              src={service.imageUrl}
              alt={service.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{service.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
        {service.features && service.features.length > 0 && (
          <ul className="space-y-1">
            {service.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="text-sm text-gray-500 flex items-center">
                <span className="text-blue-600 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
          Learn More
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

