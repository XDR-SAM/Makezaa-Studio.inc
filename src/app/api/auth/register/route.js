import { NextResponse } from 'next/server';
import { createUser } from '@/models/User';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await createUser(email, password);
    
    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    );
  } catch (error) {
    if (error.message === 'User already exists') {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}

