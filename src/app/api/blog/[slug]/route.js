import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET single blog by slug
export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const blogsCollection = await getCollection('blogs');

        const blog = await blogsCollection.findOne({ slug });

        if (!blog) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        // Increment view count
        await blogsCollection.updateOne(
            { slug },
            { $inc: { views: 1 } }
        );

        return NextResponse.json({
            success: true,
            data: blog,
        });
    } catch (error) {
        console.error('Get blog error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blog' },
            { status: 500 }
        );
    }
}

// PUT update blog (admin only)
export async function PUT(request, { params }) {
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

        const { slug } = await params;
        const body = await request.json();
        const { title, content, category, imageUrl } = body;

        const blogsCollection = await getCollection('blogs');

        // Check if blog exists
        const existing = await blogsCollection.findOne({ slug });
        if (!existing) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        // Prepare update
        const update = {
            updatedAt: new Date(),
        };

        if (title) {
            update.title = title;
            // Generate new slug if title changed
            if (title !== existing.title) {
                update.slug = title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
            }
        }
        if (content) update.content = content;
        if (category) update.category = category;
        if (imageUrl !== undefined) update.imageUrl = imageUrl;

        // Update blog
        await blogsCollection.updateOne(
            { slug },
            { $set: update }
        );

        const updatedBlog = await blogsCollection.findOne({
            slug: update.slug || slug
        });

        return NextResponse.json({
            success: true,
            data: updatedBlog,
        });
    } catch (error) {
        console.error('Update blog error:', error);
        return NextResponse.json(
            { error: 'Failed to update blog' },
            { status: 500 }
        );
    }
}

// DELETE blog (admin only)
export async function DELETE(request, { params }) {
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

        const { slug } = await params;
        const blogsCollection = await getCollection('blogs');

        const result = await blogsCollection.deleteOne({ slug });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Blog deleted successfully',
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        return NextResponse.json(
            { error: 'Failed to delete blog' },
            { status: 500 }
        );
    }
}
