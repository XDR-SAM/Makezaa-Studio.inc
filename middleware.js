import { NextResponse } from 'next/server';
import { verifyToken } from './src/lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect admin routes (except login)
  if (pathname.startsWith('/xd') && pathname !== '/xd/login') {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      const url = new URL('/xd/login', request.url);
      return NextResponse.redirect(url);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      const url = new URL('/xd/login', request.url);
      const response = NextResponse.redirect(url);
      response.cookies.delete('auth-token', { path: '/' });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/xd/:path*'],
};

