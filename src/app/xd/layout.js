'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '/xd', icon: '📊' },
        { name: 'Blogs', href: '/xd/blogs', icon: '📝' },
        { name: 'Projects', href: '/xd/projects', icon: '💼' },
        { name: 'Services', href: '/xd/services', icon: '⚙️' },
        { name: 'Testimonials', href: '/xd/testimonials', icon: '⭐' },
    ];

    return (
        <div className="flex min-h-screen bg-base-200">
            {/* Sidebar */}
            <aside className="w-64 bg-base-100 shadow-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
                </div>

                <nav className="px-4">
                    <ul className="menu">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={pathname === item.href ? 'active' : ''}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 mt-auto">
                    <Link href="/" className="btn btn-outline btn-sm w-full">
                        ← Back to Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
