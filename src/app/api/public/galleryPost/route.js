import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GalleryPost from '@/models/GalleryPost';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const year = searchParams.get('year');
    const location = searchParams.get('location');
    
    const skip = (page - 1) * limit;

    const query = { isActive: true };
    if (year) query.year = parseInt(year);
    if (location) query.location = new RegExp(location, 'i');
    
    const [posts, total] = await Promise.all([
      GalleryPost.find(query)
        .sort({ position: 1 })
        .skip(skip)
        .limit(limit)
        .select('title description year location venue images thumbnailIndex createdAt')
        .lean(),
      GalleryPost.countDocuments(query)
    ]);

    const postsWithThumbnails = posts.map(post => {
      const thumbnailIndex = Math.min(post.thumbnailIndex || 0, post.images.length - 1);
      return {
        ...post,
        thumbnail: post.images[thumbnailIndex]
      };
    });
    
    return NextResponse.json({
      posts: postsWithThumbnails,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Public Gallery POST GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery posts' },
      { status: 500 }
    );
  }
}
