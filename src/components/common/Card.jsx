import Image from 'next/image';
import Link from 'next/link';

export default function Card({
    title,
    description,
    imageUrl,
    href,
    category,
    date,
    className = ''
}) {
    const content = (
        <div className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${className}`}>
            {imageUrl && (
                <figure className="relative h-48 w-full overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </figure>
            )}
            <div className="card-body">
                {category && (
                    <div className="badge badge-primary badge-sm">{category}</div>
                )}
                <h3 className="card-title text-lg">{title}</h3>
                <p className="text-gray-600 line-clamp-3">{description}</p>
                {date && (
                    <div className="text-sm text-gray-500 mt-2">
                        {new Date(date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </div>
                )}
                {href && (
                    <div className="card-actions justify-end mt-4">
                        <button className="btn btn-primary btn-sm">Read More</button>
                    </div>
                )}
            </div>
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
}
