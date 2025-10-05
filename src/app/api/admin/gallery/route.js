import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ImageGallery from '@/models/ImageGallery';
import r2 from '@/lib/r2';
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

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const isActive = searchParams.get('active') !== 'false';
    
    const skip = (page - 1) * limit;
    
    const query = { isActive };
    
    const [images, total] = await Promise.all([
      ImageGallery.find(query)
        .populate('uploadedBy', 'username')
        .sort({ position: 1 })
        .skip(skip)
        .limit(limit),
      ImageGallery.countDocuments(query)
    ]);
    
    return NextResponse.json({
      images,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalImages: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Gallery GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const user = await getUserFromToken(request);
    
    const formData = await request.formData();
    const files = formData.getAll('files');
    const titles = formData.getAll('titles'); 
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Only JPEG, PNG, and WebP are allowed.` },
          { status: 400 }
        );
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Maximum size is 10MB.` },
          { status: 400 }
        );
      }
    }
    
    const uploadedImages = [];
    let currentPosition = await ImageGallery.getNextPosition();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const title = titles[i] || file.name.split('.')[0];
      
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const originalName = file.name.split('.')[0];
        const extension = file.name.split('.').pop();
        const fileName = `${originalName}_${timestamp}.${extension}`;

        const { width, height } = getImageDimensions(buffer);

        const uploadResponse = await r2.uploadFile({
          buffer: buffer,
          fileName: fileName,
          contentType: file.type,
          folder: 'nkpol_dev/gallery'
        });

        const imageRecord = await ImageGallery.create({
          title: title,
          image: {
            url: uploadResponse.url,
            key: uploadResponse.key,
            thumbnailUrl: uploadResponse.thumbnailUrl,
            name: uploadResponse.name,
            size: uploadResponse.size,
            contentType: file.type,
            width: width,
            height: height,
            etag: uploadResponse.etag
          },
          position: currentPosition + i,
          uploadedBy: user.userId
        });
        
        await imageRecord.populate('uploadedBy', 'username');
        uploadedImages.push(imageRecord);
        
      } catch (uploadError) {
        console.error(`Error uploading file ${file.name}:`, uploadError);
        uploadedImages.push({
          error: `Failed to upload ${file.name}: ${uploadError.message}`,
          fileName: file.name
        });
      }
    }
    
    return NextResponse.json({
      message: `Successfully processed ${files.length} file(s)`,
      images: uploadedImages,
      successCount: uploadedImages.filter(img => !img.error).length,
      errorCount: uploadedImages.filter(img => img.error).length
    }, { status: 201 });
    
  } catch (error) {
    console.error('Gallery POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload images' },
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
      const { imageIds } = data;
      
      if (!imageIds || !Array.isArray(imageIds)) {
        return NextResponse.json(
          { error: 'Invalid imageIds array' },
          { status: 400 }
        );
      }
      
      await ImageGallery.reorderPositions(imageIds);
      
      return NextResponse.json({
        message: 'Images reordered successfully'
      }, { status: 200 });
      
    } else if (action === 'update') {
      const { id, title, isActive } = data;
      
      if (!id) {
        return NextResponse.json(
          { error: 'Image ID is required' },
          { status: 400 }
        );
      }
      
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (isActive !== undefined) updateData.isActive = isActive;
      
      const updatedImage = await ImageGallery.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
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
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Gallery PUT error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update' },
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
        { error: 'Image ID or IDs required' },
        { status: 400 }
      );
    }
    
    const imagesToDelete = ids ? ids : [id];
    const deletedImages = [];
    const errors = [];
    
    for (const imageId of imagesToDelete) {
      try {
        const image = await ImageGallery.findById(imageId);
        if (!image) {
          errors.push(`Image with ID ${imageId} not found`);
          continue;
        }

        try {
          await r2.deleteFile(image.image.key);
        } catch (r2Error) {
          console.error(`Failed to delete from R2: ${r2Error.message}`);
        }
        
        await ImageGallery.findByIdAndDelete(imageId);
        deletedImages.push(imageId);
        
      } catch (deleteError) {
        console.error(`Error deleting image ${imageId}:`, deleteError);
        errors.push(`Failed to delete image ${imageId}: ${deleteError.message}`);
      }
    }
    
    return NextResponse.json({
      message: `Successfully deleted ${deletedImages.length} image(s)`,
      deletedIds: deletedImages,
      errors: errors,
      successCount: deletedImages.length,
      errorCount: errors.length
    }, { status: 200 });
    
  } catch (error) {
    console.error('Gallery DELETE error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete images' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    );
  }
}