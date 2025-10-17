import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimony from '@/models/Testimony';
import User from '@/models/User';
import StorageFactory from '@/lib/storage';
import { getUserFromToken } from '@/lib/auth';

function getImageDimensions(buffer) {


  return { width: null, height: null };
}

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const isActive = searchParams.get('active') !== 'false';
    const star = searchParams.get('star');
    
    const skip = (page - 1) * limit;

    const query = { isActive };
    if (star) query.star = parseInt(star);
    
    const [testimonies, total] = await Promise.all([
      Testimony.find(query)
        .populate('uploadedBy', 'username')
        .sort({ position: 1 })
        .skip(skip)
        .limit(limit),
      Testimony.countDocuments(query)
    ]);

    const storage = StorageFactory.getInstance();
    const storageInfo = storage.getStorageInfo();
    
    return NextResponse.json({
      testimonies,
      storageInfo,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTestimonies: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Testimony GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonies' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const user = await getUserFromToken(request);
    
    const formData = await request.formData();
    const file = formData.get('profileImage');
    const name = formData.get('name');
    const title = formData.get('title');
    const text = formData.get('text');
    const star = formData.get('star');

    if (!file) {
      return NextResponse.json(
        { error: 'Profile image is required' },
        { status: 400 }
      );
    }

    if (!name || !text || !star) {
      return NextResponse.json(
        { error: 'Name, text, and star rating are required' },
        { status: 400 }
      );
    }

    const starRating = parseInt(star);
    if (isNaN(starRating) || starRating < 1 || starRating > 5) {
      return NextResponse.json(
        { error: 'Star rating must be a number between 1 and 5' },
        { status: 400 }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Only JPEG, PNG, and WebP are allowed for profile images.` },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: `File ${file.name} is too large. Maximum size is 5MB for profile images.` },
        { status: 400 }
      );
    }

    const storage = StorageFactory.getInstance();
    
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const timestamp = Date.now();
      const originalName = file.name.split('.')[0];
      const extension = file.name.split('.').pop();
      const fileName = `profile_${timestamp}.${extension}`;

      const { width, height } = getImageDimensions(buffer);

      const uploadResponse = await storage.uploadFile({
        buffer: buffer,
        fileName: fileName,
        contentType: file.type,
        folder: 'nkpol_dev/testimonies'
      });

      const position = await Testimony.getNextPosition();

      const testimonyData = {
        name: name.trim(),
        text: text.trim(),
        star: starRating,
        profileImage: {
          url: uploadResponse.url,
          key: uploadResponse.key,
          thumbnailUrl: uploadResponse.thumbnailUrl,
          name: uploadResponse.name,
          size: uploadResponse.size,
          contentType: file.type,
          width: uploadResponse.width || width,
          height: uploadResponse.height || height,
          etag: uploadResponse.etag,
          storageType: uploadResponse.storageType
        },
        position: position,
        uploadedBy: user.userId
      };

      if (title && title.trim()) {
        testimonyData.title = title.trim();
      }

      const testimonyRecord = await Testimony.create(testimonyData);
      
      await testimonyRecord.populate('uploadedBy', 'username');
      
      return NextResponse.json({
        message: 'Testimony created successfully',
        testimony: testimonyRecord
      }, { status: 201 });
      
    } catch (uploadError) {
      console.error(`Error creating testimony:`, uploadError);
      return NextResponse.json(
        { error: `Failed to create testimony: ${uploadError.message}` },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Testimony POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create testimony' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();

    await getUserFromToken(request);
    
    const { action, ...data } = await request.json();
    
    if (action === 'reorder') {

      const { testimonyIds } = data;
      
      if (!testimonyIds || !Array.isArray(testimonyIds)) {
        return NextResponse.json(
          { error: 'Invalid testimonyIds array' },
          { status: 400 }
        );
      }
      
      await Testimony.reorderPositions(testimonyIds);
      
      return NextResponse.json({
        message: 'Testimonies reordered successfully'
      }, { status: 200 });
      
    } else if (action === 'update') {

      const { id, name, title, text, star, isActive } = data;
      
      if (!id) {
        return NextResponse.json(
          { error: 'Testimony ID is required' },
          { status: 400 }
        );
      }
      
      const updateData = {};
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
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Testimony PUT error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update testimonies' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();

    await getUserFromToken(request);
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const ids = searchParams.get('ids')?.split(',');
    
    if (!id && !ids) {
      return NextResponse.json(
        { error: 'Testimony ID or IDs required' },
        { status: 400 }
      );
    }
    
    const testimoniesToDelete = ids ? ids : [id];
    const deletedTestimonies = [];
    const errors = [];
    
    for (const testimonyId of testimoniesToDelete) {
      try {
        const testimony = await Testimony.findById(testimonyId);
        if (!testimony) {
          errors.push(`Testimony with ID ${testimonyId} not found`);
          continue;
        }

        let storage;
        try {
          if (testimony.profileImage.storageType === 'imagekit') {
            storage = new (await import('@/lib/storage')).ImageKitAdapter();
          } else {
            storage = new (await import('@/lib/storage')).CloudflareR2Adapter();
          }
          
          await storage.deleteFile(testimony.profileImage.key);
        } catch (storageError) {
          console.error(`Failed to delete from ${testimony.profileImage.storageType}: ${storageError.message}`);

        }

        await Testimony.findByIdAndDelete(testimonyId);
        deletedTestimonies.push(testimonyId);
        
      } catch (deleteError) {
        console.error(`Error deleting testimony ${testimonyId}:`, deleteError);
        errors.push(`Failed to delete testimony ${testimonyId}: ${deleteError.message}`);
      }
    }
    
    return NextResponse.json({
      message: `Successfully deleted ${deletedTestimonies.length} testimonies`,
      deletedIds: deletedTestimonies,
      errors: errors,
      successCount: deletedTestimonies.length,
      errorCount: errors.length
    }, { status: 200 });
    
  } catch (error) {
    console.error('Testimony DELETE error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete testimonies' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    );
  }
}