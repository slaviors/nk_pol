import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimony from '@/models/Testimony';
import StorageFactory from '@/lib/storage';
import jwt from 'jsonwebtoken';

async function getUserFromToken(request) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    throw new Error('No token provided');
  }
  
  const decoded = jwt.verify(token, process.env.JWT_TOKEN);
  return decoded;
}

function getImageDimensions(buffer) {


  return { width: null, height: null };
}

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    const testimony = await Testimony.findById(id)
      .populate('uploadedBy', 'username');
    
    if (!testimony) {
      return NextResponse.json(
        { error: 'Testimony not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ testimony }, { status: 200 });
    
  } catch (error) {
    console.error('Testimony GET single error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimony' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    await getUserFromToken(request);
    
    const { id } = params;
    const contentType = request.headers.get('content-type');

    let updateData = {};
    
    if (contentType?.includes('multipart/form-data')) {

      const formData = await request.formData();
      const name = formData.get('name');
      const title = formData.get('title');
      const text = formData.get('text');
      const star = formData.get('star');
      const isActive = formData.get('isActive');
      const position = formData.get('position');
      const newProfileImage = formData.get('profileImage');

      if (name !== null) updateData.name = name;
      if (title !== null) updateData.title = title;
      if (text !== null) updateData.text = text;
      if (star !== null) {
        const starRating = parseInt(star);
        if (isNaN(starRating) || starRating < 1 || starRating > 5) {
          return NextResponse.json(
            { error: 'Star rating must be a number between 1 and 5' },
            { status: 400 }
          );
        }
        updateData.star = starRating;
      }
      if (isActive !== null) updateData.isActive = isActive === 'true';
      if (position !== null) updateData.position = parseInt(position);

      if (newProfileImage && newProfileImage.size > 0) {

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(newProfileImage.type)) {
          return NextResponse.json(
            { error: `Invalid file type: ${newProfileImage.type}. Only JPEG, PNG, and WebP are allowed.` },
            { status: 400 }
          );
        }

        if (newProfileImage.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: 'File is too large. Maximum size is 5MB.' },
            { status: 400 }
          );
        }

        const existingTestimony = await Testimony.findById(id);
        if (!existingTestimony) {
          return NextResponse.json(
            { error: 'Testimony not found' },
            { status: 404 }
          );
        }

        try {
          let storage;
          if (existingTestimony.profileImage.storageType === 'imagekit') {
            storage = new (await import('@/lib/storage')).ImageKitAdapter();
          } else {
            storage = new (await import('@/lib/storage')).CloudflareR2Adapter();
          }
          
          await storage.deleteFile(existingTestimony.profileImage.key);
        } catch (storageError) {
          console.error(`Failed to delete old image: ${storageError.message}`);

        }

        const storage = StorageFactory.getInstance();
        const bytes = await newProfileImage.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const originalName = newProfileImage.name.split('.')[0];
        const extension = newProfileImage.name.split('.').pop();
        const fileName = `profile_${timestamp}.${extension}`;

        const { width, height } = getImageDimensions(buffer);

        const uploadResponse = await storage.uploadFile({
          buffer: buffer,
          fileName: fileName,
          contentType: newProfileImage.type,
          folder: 'nkpol_dev/testimonies'
        });

        updateData.profileImage = {
          url: uploadResponse.url,
          key: uploadResponse.key,
          thumbnailUrl: uploadResponse.thumbnailUrl,
          name: uploadResponse.name,
          size: uploadResponse.size,
          contentType: newProfileImage.type,
          width: uploadResponse.width || width,
          height: uploadResponse.height || height,
          etag: uploadResponse.etag,
          storageType: uploadResponse.storageType
        };
      }
    } else {

      const { name, title, text, star, isActive, position } = await request.json();
      
      if (name !== undefined) updateData.name = name;
      if (title !== undefined) updateData.title = title;
      if (text !== undefined) updateData.text = text;
      if (star !== undefined) {
        const starRating = parseInt(star);
        if (isNaN(starRating) || starRating < 1 || starRating > 5) {
          return NextResponse.json(
            { error: 'Star rating must be a number between 1 and 5' },
            { status: 400 }
          );
        }
        updateData.star = starRating;
      }
      if (isActive !== undefined) updateData.isActive = isActive;
      if (position !== undefined) updateData.position = position;
    }
    
    const updatedTestimony = await Testimony.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'username');
    
    if (!updatedTestimony) {
      return NextResponse.json(
        { error: 'Testimony not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Testimony updated successfully',
      testimony: updatedTestimony
    }, { status: 200 });
    
  } catch (error) {
    console.error('Testimony PUT single error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update testimony' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    await getUserFromToken(request);
    
    const { id } = params;

    const testimony = await Testimony.findById(id);
    if (!testimony) {
      return NextResponse.json(
        { error: 'Testimony not found' },
        { status: 404 }
      );
    }

    try {
      let storage;
      if (testimony.profileImage.storageType === 'imagekit') {
        const { ImageKitAdapter } = await import('@/lib/storage');
        storage = new ImageKitAdapter();
      } else {
        const { CloudflareR2Adapter } = await import('@/lib/storage');
        storage = new CloudflareR2Adapter();
      }
      
      await storage.deleteFile(testimony.profileImage.key);
    } catch (storageError) {
      console.error(`Failed to delete from ${testimony.profileImage.storageType}: ${storageError.message}`);

    }

    await Testimony.findByIdAndDelete(id);
    
    return NextResponse.json({
      message: 'Testimony deleted successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Testimony DELETE single error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete testimony' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    );
  }
}