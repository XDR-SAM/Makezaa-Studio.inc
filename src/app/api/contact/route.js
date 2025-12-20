import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

// POST contact form submission
export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        const contactsCollection = await getCollection('contacts');

        const newContact = {
            name,
            email,
            subject: subject || 'No subject',
            message,
            status: 'new',
            createdAt: new Date(),
        };

        const result = await contactsCollection.insertOne(newContact);

        return NextResponse.json({
            success: true,
            message: 'Your message has been sent successfully!',
            data: { ...newContact, _id: result.insertedId },
        }, { status: 201 });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}
