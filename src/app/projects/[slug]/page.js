import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

async function getProject(slug) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/projects/${slug}`, {
        cache: 'no-store',
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        return {
            title: 'Project Not Found',
        };
    }

    return {
        title: `${project.title} | Makezaa Projects`,
        description: project.description,
        openGraph: {
            title: project.title,
            description: project.description,
            images: project.imageUrl ? [project.imageUrl] : [],
        },
    };
}

export default async function ProjectDetailPage({ params }) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <Link href="/projects" className="btn btn-ghost btn-sm mb-6">
                ← Back to Projects
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Project Image */}
                {project.imageUrl && (
                    <div className="relative w-full h-96 lg:h-full rounded-lg overflow-hidden">
                        <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Project Details */}
                <div>
                    <div className="badge badge-primary mb-4">{project.category}</div>
                    <h1 className="text-4xl font-bold mb-4">{project.title}</h1>

                    {project.client && (
                        <p className="text-gray-600 mb-6">
                            <span className="font-semibold">Client:</span> {project.client}
                        </p>
                    )}

                    <div className="prose max-w-none mb-8">
                        <p className="text-lg">{project.description}</p>
                    </div>

                    {project.technologies && project.technologies.length > 0 && (
                        <div className="mb-8">
                            <h3 className="font-semibold text-lg mb-3">Technologies Used</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech, index) => (
                                    <span key={index} className="badge badge-outline">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <Link href="/contact" className="btn btn-primary btn-lg">
                        Start Your Project
                    </Link>
                </div>
            </div>
        </div>
    );
}
