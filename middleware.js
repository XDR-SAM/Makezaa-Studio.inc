import { NextResponse } from 'next/server';
import { verifyToken } from './src/lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect admin routes (except login)
  if (pathname.startsWith('/xd') && !pathname.startsWith('/xd/login')) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/xd/login', request.url));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      const response = NextResponse.redirect(new URL('/xd/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/xd/:path*'],
};

