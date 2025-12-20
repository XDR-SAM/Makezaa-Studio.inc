import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET all testimonials
export async function GET() {
    try {
        const testimonialsCollection = await getCollection('testimonials');

        const testimonials = await testimonialsCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({
            success: true,
            data: testimonials,
        });
    } catch (error) {
        console.error('Get testimonials error:', error);
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}

// POST create new testimonial (admin only)
export async function POST(request) {
    try {
        const token = getTokenFromRequest(request);
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, company, position, content, rating, imageUrl } = body;

        if (!name || !content || !rating) {
            return NextResponse.json(
                { error: 'Name, content, and rating are required' },
                { status: 400 }
            );
        }

        const testimonialsCollection = await getCollection('testimonials');

        const newTestimonial = {
            name,
            company: company || '',
            position: position || '',
            content,
            rating: parseInt(rating),
            imageUrl: imageUrl || '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await testimonialsCollection.insertOne(newTestimonial);

        return NextResponse.json({
            success: true,
            data: { ...newTestimonial, _id: result.insertedId },
        }, { status: 201 });
    } catch (error) {
        console.error('Create testimonial error:', error);
        return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }
}

// PUT update testimonial (admin only)
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
            return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
        }

        const testimonialsCollection = await getCollection('testimonials');
        const { ObjectId } = require('mongodb');

        await testimonialsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updates, updatedAt: new Date() } }
        );

        const updated = await testimonialsCollection.findOne({ _id: new ObjectId(id) });

        return NextResponse.json({
            success: true,
            data: updated,
        });
    } catch (error) {
        console.error('Update testimonial error:', error);
        return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
    }
}

// DELETE testimonial (admin only)
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
            return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
        }

        const testimonialsCollection = await getCollection('testimonials');
        const { ObjectId } = require('mongodb');

        const result = await testimonialsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Testimonial deleted successfully',
        });
    } catch (error) {
        console.error('Delete testimonial error:', error);
        return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
    }
}
