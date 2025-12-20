import { NextResponse } from 'next/server';
import { verifyToken } from './src/lib/auth';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Protect admin routes
    if (pathname.startsWith('/xd')) {
        // Allow access to login page
        if (pathname === '/xd/login' || pathname === '/login') {
            return NextResponse.next();
        }

        // Check for authentication token
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Verify token
        const decoded = verifyToken(token);
        if (!decoded) {
            // Clear invalid token
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            return response;
        }

        // Token is valid, allow access
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/xd/:path*'],
};
