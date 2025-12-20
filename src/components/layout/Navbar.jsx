'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Check if user is logged in by checking for token cookie
        const checkAuth = () => {
            const cookies = document.cookie.split(';');
            const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
            setIsLoggedIn(!!tokenCookie);
        };

        checkAuth();
    }, [pathname]);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Projects', href: '/projects' },
        { name: 'Blog', href: '/blog' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setIsLoggedIn(false);
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto">
                <div className="flex-1">
                    <Link href="/" className="btn btn-ghost text-xl font-bold text-primary">
                        Makezaa
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="flex-none hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 gap-2">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={pathname === link.href ? 'active' : ''}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                        {isLoggedIn && (
                            <>
                                <li>
                                    <Link href="/xd" className="btn btn-primary btn-sm">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex-none lg:hidden">
                    <button
                        className="btn btn-square btn-ghost"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block w-5 h-5 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-base-100 shadow-lg">
                    <ul className="menu menu-vertical px-4 py-2">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={pathname === link.href ? 'active' : ''}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                        {isLoggedIn && (
                            <>
                                <li>
                                    <Link href="/xd" onClick={() => setIsMenuOpen(false)}>
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
}
