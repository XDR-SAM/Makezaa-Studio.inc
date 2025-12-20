import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary">404</h1>
                <h2 className="text-4xl font-bold mt-4 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8">
                    Sorry, the page you're looking for doesn't exist.
                </p>
                <Link href="/" className="btn btn-primary btn-lg">
                    Go Home
                </Link>
            </div>
        </div>
    );
}
