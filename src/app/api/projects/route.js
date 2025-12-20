import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET all projects with filtering and sorting
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') || '';
        const sort = searchParams.get('sort') || 'createdAt';
        const order = searchParams.get('order') || 'desc';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');

        const projectsCollection = await getCollection('projects');

        // Build query
        const query = {};
        if (category) {
            query.category = category;
        }

        // Get total count
        const total = await projectsCollection.countDocuments(query);

        // Get projects
        const projects = await projectsCollection
            .find(query)
            .sort({ [sort]: order === 'desc' ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        return NextResponse.json({
            success: true,
            data: projects,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get projects error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

// POST create new project (admin only)
export async function POST(request) {
    try {
        const token = getTokenFromRequest(request);
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, category, client, imageUrl, technologies } = body;

        if (!title || !description || !category) {
            return NextResponse.json(
                { error: 'Title, description, and category are required' },
                { status: 400 }
            );
        }

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const projectsCollection = await getCollection('projects');

        const existing = await projectsCollection.findOne({ slug });
        if (existing) {
            return NextResponse.json(
                { error: 'A project with this title already exists' },
                { status: 400 }
            );
        }

        const newProject = {
            title,
            slug,
            description,
            category,
            client: client || '',
            imageUrl: imageUrl || '',
            technologies: technologies || [],
            createdByEmail: decoded.email,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await projectsCollection.insertOne(newProject);

        return NextResponse.json({
            success: true,
            data: { ...newProject, _id: result.insertedId },
        }, { status: 201 });
    } catch (error) {
        console.error('Create project error:', error);
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
}
