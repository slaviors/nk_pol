// src/app/api/public/imageGallery/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ImageGallery from '@/models/ImageGallery';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 4;
    const year = searchParams.get('year');
    const location = searchParams.get('location');
    const venue = searchParams.get('venue');
    
    const skip = (page - 1) * limit;

    const query = { isActive: true };
    if (year) query.year = parseInt(year);
    if (location) query.location = new RegExp(location, 'i');
    if (venue) query.venue = new RegExp(venue, 'i');
    
    const [images, total] = await Promise.all([
      ImageGallery.find(query)
        .sort({ position: 1 })
        .skip(skip)
        .limit(limit)
        .select('title description year location venue image position createdAt')
        .lean(),
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
    console.error('Public Gallery GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}