import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function POST() {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: 'admin1@gmail.com' });
    
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 200 }
      );
    }

    const hashedPassword = await hashPassword('sami123');
    
    const admin = new User({
      email: 'admin1@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();

    return NextResponse.json(
      { message: 'Admin user created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
