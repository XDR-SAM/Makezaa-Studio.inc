import Link from 'next/link';
import Image from 'next/image';

export default function BlogCard({ blog }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {blog.imageUrl && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
              {blog.category}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3">
            {blog.content?.substring(0, 150)}...
          </p>
          <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
            Read More
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

