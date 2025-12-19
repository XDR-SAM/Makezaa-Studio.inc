import Image from 'next/image';

export default function ServiceCard({ service }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
      {service.imageUrl && (
        <div className="relative h-32 w-full mb-4 rounded-lg overflow-hidden">
          <Image
            src={service.imageUrl}
            alt={service.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
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
    </div>
  );
}

