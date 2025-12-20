import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET all blogs with search, filter, sort, pagination
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        const sort = searchParams.get('sort') || 'createdAt';
        const order = searchParams.get('order') || 'desc';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const blogsCollection = await getCollection('blogs');

        // Build query
        const query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
            ];
        }
        if (category) {
            query.category = category;
        }

        // Get total count
        const total = await blogsCollection.countDocuments(query);

        // Get blogs
        const blogs = await blogsCollection
            .find(query)
            .sort({ [sort]: order === 'desc' ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        return NextResponse.json({
            success: true,
            data: blogs,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get blogs error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blogs' },
            { status: 500 }
        );
    }
}

// POST create new blog (admin only)
export async function POST(request) {
    try {
        // Verify authentication
        const token = getTokenFromRequest(request);
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, content, category, imageUrl } = body;

        // Validate required fields
        if (!title || !content || !category) {
            return NextResponse.json(
                { error: 'Title, content, and category are required' },
                { status: 400 }
            );
        }

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const blogsCollection = await getCollection('blogs');

        // Check if slug already exists
        const existing = await blogsCollection.findOne({ slug });
        if (existing) {
            return NextResponse.json(
                { error: 'A blog with this title already exists' },
                { status: 400 }
            );
        }

        // Create blog
        const newBlog = {
            title,
            slug,
            content,
            category,
            imageUrl: imageUrl || '',
            createdByEmail: decoded.email,
            createdAt: new Date(),
            updatedAt: new Date(),
            views: 0,
        };

        const result = await blogsCollection.insertOne(newBlog);

        return NextResponse.json({
            success: true,
            data: { ...newBlog, _id: result.insertedId },
        }, { status: 201 });
    } catch (error) {
        console.error('Create blog error:', error);
        return NextResponse.json(
            { error: 'Failed to create blog' },
            { status: 500 }
        );
    }
}
