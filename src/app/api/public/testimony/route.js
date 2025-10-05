import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimony from '@/models/Testimony';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const star = searchParams.get('star');
    
    const skip = (page - 1) * limit;

    const query = { isActive: true };
    if (star) query.star = parseInt(star);
    
    const [testimonies, total] = await Promise.all([
      Testimony.find(query)
        .sort({ position: 1 })
        .skip(skip)
        .limit(limit)
        .select('name title text star profileImage.url profileImage.thumbnailUrl position createdAt')
        .lean(),       Testimony.countDocuments(query)
    ]);
    
    return NextResponse.json({
      testimonies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTestimonies: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Public Testimony GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonies' },
      { status: 500 }
    );
  }
}