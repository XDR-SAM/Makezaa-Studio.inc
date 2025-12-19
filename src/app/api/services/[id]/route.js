import { NextResponse } from 'next/server';
import { getServiceById, updateService, deleteService } from '@/models/Service';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const service = await getServiceById(params.id);
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch service', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const result = await updateService(params.id, data);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Service updated successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update service', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const result = await deleteService(params.id);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete service', details: error.message },
      { status: 500 }
    );
  }
}

