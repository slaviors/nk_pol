import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GalleryPost from '@/models/GalleryPost';
import User from '@/models/User';
import StorageFactory from '@/lib/storage';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const isActive = searchParams.get('active') !== 'false';
    
    const skip = (page - 1) * limit;

    const query = { isActive };
    
    const [posts, total] = await Promise.all([
      GalleryPost.find(query)
        .populate('uploadedBy', 'username')
        .sort({ position: 1 })
        .skip(skip)
        .limit(limit),
      GalleryPost.countDocuments(query)
    ]);

    const storage = StorageFactory.getInstance();
    const storageInfo = storage.getStorageInfo();
    
    return NextResponse.json({
      posts,
      storageInfo,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Gallery POST GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery posts' },
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
    const title = formData.get('title');
    const description = formData.get('description');
    const year = formData.get('year');
    const location = formData.get('location');
    const venue = formData.get('venue');
    const thumbnailIndex = parseInt(formData.get('thumbnailIndex')) || 0;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'At least 1 image is required' },
        { status: 400 }
      );
    }

    if (files.length > 4) {
      return NextResponse.json(
        { error: 'Maximum 4 images allowed per post' },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
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
    const uploadedImages = [];

    try {
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const extension = file.name.split('.').pop();
        const fileName = `gallery_${timestamp}_${randomStr}.${extension}`;

        const uploadResponse = await storage.uploadFile({
          buffer: buffer,
          fileName: fileName,
          contentType: file.type,
          folder: 'nkpol_dev/gallery_posts'
        });

        uploadedImages.push({
          url: uploadResponse.url,
          key: uploadResponse.key,
          thumbnailUrl: uploadResponse.thumbnailUrl,
          name: uploadResponse.name,
          size: uploadResponse.size,
          contentType: file.type,
          width: uploadResponse.width,
          height: uploadResponse.height,
          etag: uploadResponse.etag,
          storageType: uploadResponse.storageType
        });
      }

      const position = await GalleryPost.getNextPosition();

      const postData = {
        title: title.trim(),
        description: description?.trim() || '',
        images: uploadedImages,
        thumbnailIndex: Math.min(thumbnailIndex, uploadedImages.length - 1),
        position: position,
        uploadedBy: user.userId
      };

      if (year) postData.year = parseInt(year);
      if (location) postData.location = location.trim();
      if (venue) postData.venue = venue.trim();

      const newPost = await GalleryPost.create(postData);
      await newPost.populate('uploadedBy', 'username');

      return NextResponse.json({
        message: 'Gallery post created successfully',
        post: newPost
      }, { status: 201 });

    } catch (uploadError) {
      console.error('Upload error:', uploadError);

      for (const image of uploadedImages) {
        try {
          await storage.deleteFile(image.key);
        } catch (cleanupError) {
          console.error('Cleanup error:', cleanupError);
        }
      }

      return NextResponse.json(
        { error: 'Failed to upload images: ' + uploadError.message },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Gallery POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery post: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    await getUserFromToken(request);
    
    const body = await request.json();
    const { action, postIds, postId, thumbnailIndex, ...updateData } = body;

    if (action === 'reorder' && postIds) {
      if (!Array.isArray(postIds)) {
        return NextResponse.json(
          { error: 'postIds must be an array' },
          { status: 400 }
        );
      }

      await GalleryPost.reorderPositions(postIds);

      return NextResponse.json({
        message: 'Gallery posts reordered successfully'
      }, { status: 200 });
    }

    if (action === 'thumbnail' && postId !== undefined && thumbnailIndex !== undefined) {
      const post = await GalleryPost.findById(postId);
      
      if (!post) {
        return NextResponse.json(
          { error: 'Gallery post not found' },
          { status: 404 }
        );
      }

      if (thumbnailIndex < 0 || thumbnailIndex >= post.images.length) {
        return NextResponse.json(
          { error: 'Invalid thumbnail index' },
          { status: 400 }
        );
      }

      post.thumbnailIndex = thumbnailIndex;
      await post.save();

      return NextResponse.json({
        message: 'Thumbnail updated successfully',
        post
      }, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Invalid action or missing parameters' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Gallery POST PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery post' },
      { status: 500 }
    );
  }
}