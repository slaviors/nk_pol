import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ImageGallery from '@/models/ImageGallery';
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
    const year = searchParams.get('year');
    const location = searchParams.get('location');
    const venue = searchParams.get('venue');
    
    const skip = (page - 1) * limit;

    const query = { isActive };
    if (year) query.year = parseInt(year);
    if (location) query.location = new RegExp(location, 'i');
    if (venue) query.venue = new RegExp(venue, 'i');
    
    const [images, total] = await Promise.all([
      ImageGallery.find(query)
        .populate('uploadedBy', 'username')
        .sort({ position: 1 })
        .skip(skip)
        .limit(limit),
      ImageGallery.countDocuments(query)
    ]);

    const storage = StorageFactory.getInstance();
    const storageInfo = storage.getStorageInfo();

    const activeImageCount = await ImageGallery.countDocuments({ isActive: true });
    
    return NextResponse.json({
      images,
      storageInfo,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalImages: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      },
      galleryStatus: {
        totalImages: activeImageCount,
        maxImages: 4,
        remainingSlots: 4 - activeImageCount,
        isFull: activeImageCount >= 4
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
    const descriptions = formData.getAll('descriptions');
    const years = formData.getAll('years');
    const locations = formData.getAll('locations');
    const venues = formData.getAll('venues');
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const currentImageCount = await ImageGallery.countDocuments({ isActive: true });
    const remainingSlots = 4 - currentImageCount;
    
    if (remainingSlots <= 0) {
      return NextResponse.json(
        { error: 'Gallery is full. Maximum of 4 images allowed. Please delete some images before uploading new ones.' },
        { status: 400 }
      );
    }
    
    if (files.length > remainingSlots) {
      return NextResponse.json(
        { error: `Can only upload ${remainingSlots} more image(s). Gallery has a maximum of 4 images.` },
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

    const storage = StorageFactory.getInstance();
    const storageInfo = storage.getStorageInfo();
    
    const uploadedImages = [];
    let currentPosition = await ImageGallery.getNextPosition();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const title = titles[i] || file.name.split('.')[0];
      const description = descriptions[i] || '';
      const year = years[i] ? parseInt(years[i]) : undefined;
      const location = locations[i] || '';
      const venue = venues[i] || '';
      
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const originalName = file.name.split('.')[0];
        const extension = file.name.split('.').pop();
        const fileName = `${originalName}_${timestamp}.${extension}`;

        const { width, height } = getImageDimensions(buffer);

        const uploadResponse = await storage.uploadFile({
          buffer: buffer,
          fileName: fileName,
          contentType: file.type,
          folder: storageInfo.folder || 'nkpol_dev/gallery'
        });

        const imageData = {
          title: title,
          image: {
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
          position: currentPosition + i,
          uploadedBy: user.userId
        };

        if (description) imageData.description = description;
        if (year) imageData.year = year;
        if (location) imageData.location = location;
        if (venue) imageData.venue = venue;

        const imageRecord = await ImageGallery.create(imageData);
        
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

    const newImageCount = await ImageGallery.countDocuments({ isActive: true });
    
    return NextResponse.json({
      message: `Successfully processed ${files.length} file(s)`,
      images: uploadedImages,
      storageInfo,
      successCount: uploadedImages.filter(img => !img.error).length,
      errorCount: uploadedImages.filter(img => img.error).length,
      galleryStatus: {
        totalImages: newImageCount,
        maxImages: 4,
        remainingSlots: 4 - newImageCount,
        isFull: newImageCount >= 4
      }
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
      const { id, title, description, year, location, venue, isActive } = data;
      
      if (!id) {
        return NextResponse.json(
          { error: 'Image ID is required' },
          { status: 400 }
        );
      }
      
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (year !== undefined) updateData.year = year;
      if (location !== undefined) updateData.location = location;
      if (venue !== undefined) updateData.venue = venue;
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

        let storage;
        try {
          if (image.image.storageType === 'imagekit') {
            storage = new (await import('@/lib/storage')).ImageKitAdapter();
          } else {
            storage = new (await import('@/lib/storage')).CloudflareR2Adapter();
          }
          
          await storage.deleteFile(image.image.key);
        } catch (storageError) {
          console.error(`Failed to delete from ${image.image.storageType}: ${storageError.message}`);
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