import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ImageGallery from '@/models/ImageGallery';
import imagekit from '@/lib/imagekit';
import jwt from 'jsonwebtoken';

async function getUserFromToken(request) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    throw new Error('No token provided');
  }
  
  const decoded = jwt.verify(token, process.env.JWT_TOKEN);
  return decoded;
}

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
    const { title, isActive, position } = await request.json();
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
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
      await imagekit.deleteFile(image.image.fileId);
    } catch (imagekitError) {
      console.error(`Failed to delete from ImageKit: ${imagekitError.message}`);
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