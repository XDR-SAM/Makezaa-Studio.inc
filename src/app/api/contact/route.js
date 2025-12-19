import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function POST(request) {
  try {
    const { name, email, phone, company, service, message } = await request.json();

    if (!name || !email || !service || !message) {
      return NextResponse.json(
        { error: 'Name, email, service, and message are required' },
        { status: 400 }
      );
    }

    // For now, we'll just log the contact form data
    // In a real application, you might:
    // 1. Save to a database collection
    // 2. Send an email using a service like SendGrid or Nodemailer
    // 3. Send a notification to Slack
    // 4. Store in a CRM system

    console.log('Contact Form Submission:', {
      name,
      email,
      phone,
      company,
      service,
      message,
      timestamp: new Date().toISOString()
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(
      { message: 'Contact form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
