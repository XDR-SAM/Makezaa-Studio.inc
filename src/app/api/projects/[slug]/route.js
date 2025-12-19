import { NextResponse } from 'next/server';
import { getProjectBySlug, updateProject, deleteProject } from '@/models/Project';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const project = await getProjectBySlug(params.slug);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch project', details: error.message },
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
    const result = await updateProject(params.slug, data);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Project updated successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update project', details: error.message },
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

    const result = await deleteProject(params.slug);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project', details: error.message },
      { status: 500 }
    );
  }
}

