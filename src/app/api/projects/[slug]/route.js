import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET single project by slug
export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const projectsCollection = await getCollection('projects');

        const project = await projectsCollection.findOne({ slug });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: project,
        });
    } catch (error) {
        console.error('Get project error:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

// PUT update project (admin only)
export async function PUT(request, { params }) {
    try {
        const token = getTokenFromRequest(request);
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slug } = await params;
        const body = await request.json();
        const { title, description, category, client, imageUrl, technologies } = body;

        const projectsCollection = await getCollection('projects');

        const existing = await projectsCollection.findOne({ slug });
        if (!existing) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const update = { updatedAt: new Date() };

        if (title) {
            update.title = title;
            if (title !== existing.title) {
                update.slug = title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
            }
        }
        if (description) update.description = description;
        if (category) update.category = category;
        if (client !== undefined) update.client = client;
        if (imageUrl !== undefined) update.imageUrl = imageUrl;
        if (technologies) update.technologies = technologies;

        await projectsCollection.updateOne({ slug }, { $set: update });

        const updatedProject = await projectsCollection.findOne({
            slug: update.slug || slug
        });

        return NextResponse.json({
            success: true,
            data: updatedProject,
        });
    } catch (error) {
        console.error('Update project error:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

// DELETE project (admin only)
export async function DELETE(request, { params }) {
    try {
        const token = getTokenFromRequest(request);
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slug } = await params;
        const projectsCollection = await getCollection('projects');

        const result = await projectsCollection.deleteOne({ slug });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Project deleted successfully',
        });
    } catch (error) {
        console.error('Delete project error:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
