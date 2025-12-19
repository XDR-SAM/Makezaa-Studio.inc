import Link from 'next/link';
import Image from 'next/image';

export default function ProjectCard({ project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {project.imageUrl && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
              {project.category}
            </span>
            {project.rating && (
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="text-sm text-gray-600">{project.rating}</span>
              </div>
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
            {project.description}
          </p>
          {project.client && (
            <p className="text-xs text-gray-500">Client: {project.client}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

