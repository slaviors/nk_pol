import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ClientLogo from '@/models/ClientLogo';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 100; 
    const logos = await ClientLogo.find({ isActive: true })
      .sort({ position: 1 })
      .limit(limit)
      .select('title image.url image.thumbnailUrl image.contentType position createdAt')
      .lean();     
    return NextResponse.json({
      logos,
      total: logos.length
    }, { status: 200 });
    
  } catch (error) {
    console.error('Public Client Logo GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client logos' },
      { status: 500 }
    );
  }
} 