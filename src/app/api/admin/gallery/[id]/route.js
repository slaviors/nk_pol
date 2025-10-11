import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ImageGallery from '@/models/ImageGallery';
import StorageFactory from '@/lib/storage';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    const image = await ImageGallery.findById(id)
      .populate('uploadedBy', 'username');
    
    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ image }, { status: 200 });
    
  } catch (error) {
    console.error('Gallery GET single error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    await getUserFromToken(request);
    
    const { id } = params;
    const { title, description, year, location, venue, isActive, position } = await request.json();
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (year !== undefined) updateData.year = year;
    if (location !== undefined) updateData.location = location;
    if (venue !== undefined) updateData.venue = venue;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (position !== undefined) updateData.position = position;
    
    const updatedImage = await ImageGallery.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'username');
    
    if (!updatedImage) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Image updated successfully',
      image: updatedImage
    }, { status: 200 });
    
  } catch (error) {
    console.error('Gallery PUT single error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update image' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    await getUserFromToken(request);
    
    const { id } = params;

    const image = await ImageGallery.findById(id);
    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    try {
      let storage;
      if (image.image.storageType === 'imagekit') {
        const { ImageKitAdapter } = await import('@/lib/storage');
        storage = new ImageKitAdapter();
      } else {
        const { CloudflareR2Adapter } = await import('@/lib/storage');
        storage = new CloudflareR2Adapter();
      }
      
      await storage.deleteFile(image.image.key);
    } catch (storageError) {
      console.error(`Failed to delete from ${image.image.storageType}: ${storageError.message}`);
    }

    await ImageGallery.findByIdAndDelete(id);
    
    return NextResponse.json({
      message: 'Image deleted successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Gallery DELETE single error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete image' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    );
  }
}