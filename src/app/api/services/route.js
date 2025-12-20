import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET all services
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') || '';

        const servicesCollection = await getCollection('services');

        const query = category ? { category } : {};

        const services = await servicesCollection
            .find(query)
            .sort({ order: 1, createdAt: 1 })
            .toArray();

        return NextResponse.json({
            success: true,
            data: services,
        });
    } catch (error) {
        console.error('Get services error:', error);
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

// POST create new service (admin only)
export async function POST(request) {
    try {
        const token = getTokenFromRequest(request);
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, category, icon, features, order } = body;

        if (!title || !description) {
            return NextResponse.json(
                { error: 'Title and description are required' },
                { status: 400 }
            );
        }

        const servicesCollection = await getCollection('services');

        const newService = {
            title,
            description,
            category: category || 'general',
            icon: icon || '',
            features: features || [],
            order: order || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await servicesCollection.insertOne(newService);

        return NextResponse.json({
            success: true,
            data: { ...newService, _id: result.insertedId },
        }, { status: 201 });
    } catch (error) {
        console.error('Create service error:', error);
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}

// PUT update service (admin only)
export async function PUT(request) {
    try {
        const token = getTokenFromRequest(request);
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
        }

        const servicesCollection = await getCollection('services');
        const { ObjectId } = require('mongodb');

        await servicesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updates, updatedAt: new Date() } }
        );

        const updated = await servicesCollection.findOne({ _id: new ObjectId(id) });

        return NextResponse.json({
            success: true,
            data: updated,
        });
    } catch (error) {
        console.error('Update service error:', error);
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

// DELETE service (admin only)
export async function DELETE(request) {
    try {
        const token = getTokenFromRequest(request);
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
        }

        const servicesCollection = await getCollection('services');
        const { ObjectId } = require('mongodb');

        const result = await servicesCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Service deleted successfully',
        });
    } catch (error) {
        console.error('Delete service error:', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
