import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GalleryPost from '@/models/GalleryPost';
import User from '@/models/User';
import StorageFactory from '@/lib/storage';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const post = await GalleryPost.findById(id)
      .populate('uploadedBy', 'username');

    if (!post) {
      return NextResponse.json(
        { error: 'Gallery post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post }, { status: 200 });
    
  } catch (error) {
    console.error('Gallery POST GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery post' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    await getUserFromToken(request);
    
    const { id } = await params;
    const body = await request.json();

    const post = await GalleryPost.findById(id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Gallery post not found' },
        { status: 404 }
      );
    }

    if (body.title !== undefined) post.title = body.title;
    if (body.description !== undefined) post.description = body.description;
    if (body.year !== undefined) post.year = body.year;
    if (body.location !== undefined) post.location = body.location;
    if (body.venue !== undefined) post.venue = body.venue;
    if (body.thumbnailIndex !== undefined) {
      if (body.thumbnailIndex >= 0 && body.thumbnailIndex < post.images.length) {
        post.thumbnailIndex = body.thumbnailIndex;
      }
    }

    await post.save();
    await post.populate('uploadedBy', 'username');

    return NextResponse.json({
      message: 'Gallery post updated successfully',
      post
    }, { status: 200 });
    
  } catch (error) {
    console.error('Gallery POST PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    await getUserFromToken(request);
    
    const { id } = await params;
    const post = await GalleryPost.findById(id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Gallery post not found' },
        { status: 404 }
      );
    }

    const storage = StorageFactory.getInstance();
 
    for (const image of post.images) {
      try {
        await storage.deleteFile(image.key);
        console.log(`Deleted image: ${image.key}`);
      } catch (deleteError) {
        console.error(`Failed to delete image ${image.key}:`, deleteError);
      }
    }

    await GalleryPost.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Gallery post and all images deleted successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Gallery POST DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery post' },
      { status: 500 }
    );
  }
}
