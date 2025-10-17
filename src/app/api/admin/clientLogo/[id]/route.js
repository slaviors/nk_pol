import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ClientLogo from '@/models/ClientLogo';
import User from '@/models/User';
import StorageFactory from '@/lib/storage';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    const logo = await ClientLogo.findById(id)
      .populate('uploadedBy', 'username');
    
    if (!logo) {
      return NextResponse.json(
        { error: 'Client logo not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ logo }, { status: 200 });
    
  } catch (error) {
    console.error('Client Logo GET single error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client logo' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    await getUserFromToken(request);
    
    const { id } = await params;
    const { title, isActive, position } = await request.json();
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (position !== undefined) updateData.position = position;
    
    const updatedLogo = await ClientLogo.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'username');
    
    if (!updatedLogo) {
      return NextResponse.json(
        { error: 'Client logo not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Client logo updated successfully',
      logo: updatedLogo
    }, { status: 200 });
    
  } catch (error) {
    console.error('Client Logo PUT single error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update client logo' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    await getUserFromToken(request);
    
    const { id } = await params;

    const logo = await ClientLogo.findById(id);
    if (!logo) {
      return NextResponse.json(
        { error: 'Client logo not found' },
        { status: 404 }
      );
    }

    try {
      let storage;
      if (logo.image.storageType === 'imagekit') {
        const { ImageKitAdapter } = await import('@/lib/storage');
        storage = new ImageKitAdapter();
      } else {
        const { CloudflareR2Adapter } = await import('@/lib/storage');
        storage = new CloudflareR2Adapter();
      }
      
      await storage.deleteFile(logo.image.key);
    } catch (storageError) {
      console.error(`Failed to delete from ${logo.image.storageType}: ${storageError.message}`);

    }

    await ClientLogo.findByIdAndDelete(id);
    
    return NextResponse.json({
      message: 'Client logo deleted successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Client Logo DELETE single error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete client logo' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    );
  }
}