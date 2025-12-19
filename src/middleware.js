import { NextResponse } from 'next/server';

export function middleware(request) {
  // JWT validation logic here
  return NextResponse.next();
}

export const config = {
  matcher: '/xd/:path*',
};
