import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

async function getBlog(slug) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/blog/${slug}`, {
        cache: 'no-store',
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const blog = await getBlog(slug);

    if (!blog) {
        return {
            title: 'Blog Not Found',
        };
    }

    return {
        title: `${blog.title} | Makezaa Blog`,
        description: blog.content.substring(0, 160),
        openGraph: {
            title: blog.title,
            description: blog.content.substring(0, 160),
            images: blog.imageUrl ? [blog.imageUrl] : [],
        },
    };
}

export default async function BlogDetailPage({ params }) {
    const { slug } = await params;
    const blog = await getBlog(slug);

    if (!blog) {
        notFound();
    }

    return (
        <article className="container mx-auto px-4 py-12 max-w-4xl">
            <Link href="/blog" className="btn btn-ghost btn-sm mb-6">
                ← Back to Blog
            </Link>

            <header className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="badge badge-primary">{blog.category}</span>
                    <span className="text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.title}</h1>

                {blog.imageUrl && (
                    <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6">
                        <Image
                            src={blog.imageUrl}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}
            </header>

            <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap">{blog.content}</div>
            </div>

            <footer className="mt-12 pt-8 border-t">
                <p className="text-sm text-gray-500">
                    Written by {blog.createdByEmail} • {blog.views || 0} views
                </p>
            </footer>
        </article>
    );
}
