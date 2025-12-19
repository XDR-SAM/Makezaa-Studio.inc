import { NextResponse } from 'next/server';
import { getBlogs, createBlog } from '@/models/Blog';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const filters = {
      page,
      limit,
      search,
      category,
      sortBy,
      sortOrder,
    };

    const result = await getBlogs(filters);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch blogs', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const blog = await createBlog({
      ...data,
      createdByEmail: decoded.email,
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create blog', details: error.message },
      { status: 500 }
    );
  }
}

