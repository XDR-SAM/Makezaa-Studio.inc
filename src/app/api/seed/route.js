import { NextResponse } from 'next/server';
import { createUser } from '@/models/User';

export async function POST(request) {
  try {
    // Only allow seeding in development or with a secret key
    const { secret } = await request.json();
    
    if (process.env.NODE_ENV === 'production' && secret !== process.env.SEED_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create admin user
    const adminEmail = 'admin1@gmail.com';
    const adminPassword = 'sami123';

    try {
      const user = await createUser(adminEmail, adminPassword);
      return NextResponse.json({
        message: 'Admin user created successfully',
        user: { email: user.email },
      });
    } catch (error) {
      if (error.message === 'User already exists') {
        return NextResponse.json({
          message: 'Admin user already exists',
        });
      }
      throw error;
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to seed admin user', details: error.message },
      { status: 500 }
    );
  }
}

