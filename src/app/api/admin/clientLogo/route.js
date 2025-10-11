import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ClientLogo from '@/models/ClientLogo';
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
    const limit = parseInt(searchParams.get('limit')) || 50;
    const isActive = searchParams.get('active') !== 'false';
    
    const skip = (page - 1) * limit;
    
    const query = { isActive };
    
    const [logos, total] = await Promise.all([
      ClientLogo.find(query)
        .populate('uploadedBy', 'username')
        .sort({ position: 1 })
        .skip(skip)
        .limit(limit),
      ClientLogo.countDocuments(query)
    ]);

    const storage = StorageFactory.getInstance();
    const storageInfo = storage.getStorageInfo();
    
    return NextResponse.json({
      logos,
      storageInfo,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalLogos: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Client Logo GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client logos' },
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

    const allowedTypes = ['image/png', 'image/svg+xml'];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Only PNG and SVG are allowed for client logos.` },
          { status: 400 }
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Maximum size is 5MB for client logos.` },
          { status: 400 }
        );
      }
    }

    const storage = StorageFactory.getInstance();
    const storageInfo = storage.getStorageInfo();
    
    const uploadedLogos = [];
    let currentPosition = await ClientLogo.getNextPosition();

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

        const uploadResponse = await storage.uploadFile({
          buffer: buffer,
          fileName: fileName,
          contentType: file.type,
          folder: 'nkpol_dev/client_logos'
        });

        const logoData = {
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

        const logoRecord = await ClientLogo.create(logoData);
        
        await logoRecord.populate('uploadedBy', 'username');
        uploadedLogos.push(logoRecord);
        
      } catch (uploadError) {
        console.error(`Error uploading file ${file.name}:`, uploadError);
        uploadedLogos.push({
          error: `Failed to upload ${file.name}: ${uploadError.message}`,
          fileName: file.name
        });
      }
    }
    
    return NextResponse.json({
      message: `Successfully processed ${files.length} client logo(s)`,
      logos: uploadedLogos,
      storageInfo,
      successCount: uploadedLogos.filter(logo => !logo.error).length,
      errorCount: uploadedLogos.filter(logo => logo.error).length
    }, { status: 201 });
    
  } catch (error) {
    console.error('Client Logo POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload client logos' },
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

      const { logoIds } = data;
      
      if (!logoIds || !Array.isArray(logoIds)) {
        return NextResponse.json(
          { error: 'Invalid logoIds array' },
          { status: 400 }
        );
      }
      
      await ClientLogo.reorderPositions(logoIds);
      
      return NextResponse.json({
        message: 'Client logos reordered successfully'
      }, { status: 200 });
      
    } else if (action === 'update') {

      const { id, title, isActive } = data;
      
      if (!id) {
        return NextResponse.json(
          { error: 'Logo ID is required' },
          { status: 400 }
        );
      }
      
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (isActive !== undefined) updateData.isActive = isActive;
      
      const updatedLogo = await ClientLogo.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).populate('uploadedBy', 'username');
      
      if (!updatedLogo) {
        return NextResponse.json(
          { error: 'Client logo not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        message: 'Client logo updated successfully',
        logo: updatedLogo
      }, { status: 200 });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Client Logo PUT error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update client logos' },
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
        { error: 'Logo ID or IDs required' },
        { status: 400 }
      );
    }
    
    const logosToDelete = ids ? ids : [id];
    const deletedLogos = [];
    const errors = [];
    
    for (const logoId of logosToDelete) {
      try {
        const logo = await ClientLogo.findById(logoId);
        if (!logo) {
          errors.push(`Client logo with ID ${logoId} not found`);
          continue;
        }

        let storage;
        try {
          if (logo.image.storageType === 'imagekit') {
            storage = new (await import('@/lib/storage')).ImageKitAdapter();
          } else {
            storage = new (await import('@/lib/storage')).CloudflareR2Adapter();
          }
          
          await storage.deleteFile(logo.image.key);
        } catch (storageError) {
          console.error(`Failed to delete from ${logo.image.storageType}: ${storageError.message}`);

        }

        await ClientLogo.findByIdAndDelete(logoId);
        deletedLogos.push(logoId);
        
      } catch (deleteError) {
        console.error(`Error deleting client logo ${logoId}:`, deleteError);
        errors.push(`Failed to delete client logo ${logoId}: ${deleteError.message}`);
      }
    }
    
    return NextResponse.json({
      message: `Successfully deleted ${deletedLogos.length} client logo(s)`,
      deletedIds: deletedLogos,
      errors: errors,
      successCount: deletedLogos.length,
      errorCount: errors.length
    }, { status: 200 });
    
  } catch (error) {
    console.error('Client Logo DELETE error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete client logos' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    );
  }
}