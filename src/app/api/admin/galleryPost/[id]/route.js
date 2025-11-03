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
    const user = await getUserFromToken(request);

    const { id } = await params;
    const contentType = request.headers.get('content-type');

    const post = await GalleryPost.findById(id);

    if (!post) {
      return NextResponse.json(
        { error: 'Gallery post not found' },
        { status: 404 }
      );
    }

    if (contentType && contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const files = formData.getAll('files');
      const action = formData.get('action');

      if (action === 'add' && files.length > 0) {
        const totalImages = post.images.length + files.length;
        if (totalImages > 4) {
          return NextResponse.json(
            { error: `Maximum 4 images allowed. You have ${post.images.length} and trying to add ${files.length}` },
            { status: 400 }
          );
        }

        const storage = StorageFactory.getInstance();
        const uploadedImages = [];

        for (const file of files) {
          try {
            const buffer = Buffer.from(await file.arrayBuffer());
            const result = await storage.uploadFile(buffer, file.name, file.type);
            uploadedImages.push({
              url: result.url,
              key: result.key,
              thumbnailUrl: result.thumbnailUrl,
              name: result.name,
              size: result.size,
              contentType: result.contentType,
              width: result.width,
              height: result.height,
              etag: result.etag,
              storageType: result.storageType,
              isThumbnail: false
            });
          } catch (uploadError) {
            for (const img of uploadedImages) {
              try {
                await storage.deleteFile(img.key);
              } catch (e) { }
            }
            return NextResponse.json(
              { error: `Failed to upload ${file.name}` },
              { status: 500 }
            );
          }
        }

        post.images.push(...uploadedImages);
        await post.save();
        await post.populate('uploadedBy', 'username');

        return NextResponse.json({
          message: `${uploadedImages.length} image(s) added successfully`,
          post
        }, { status: 200 });

      } else if (action === 'delete') {
        const imageIndex = parseInt(formData.get('imageIndex'));

        if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= post.images.length) {
          return NextResponse.json(
            { error: 'Invalid image index' },
            { status: 400 }
          );
        }

        if (post.images.length === 1) {
          return NextResponse.json(
            { error: 'Cannot delete the last image. Post must have at least 1 image' },
            { status: 400 }
          );
        }

        const storage = StorageFactory.getInstance();
        const imageToDelete = post.images[imageIndex];

        try {
          await storage.deleteFile(imageToDelete.key);
        } catch (deleteError) {
          console.error(`Failed to delete image from storage: ${imageToDelete.key}`, deleteError);
        }

        post.images.splice(imageIndex, 1);

        if (post.thumbnailIndex >= post.images.length) {
          post.thumbnailIndex = post.images.length - 1;
        }

        await post.save();
        await post.populate('uploadedBy', 'username');

        return NextResponse.json({
          message: 'Image deleted successfully',
          post
        }, { status: 200 });

      } else if (action === 'replace') {
        const imageIndex = parseInt(formData.get('imageIndex'));

        if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= post.images.length) {
          return NextResponse.json(
            { error: 'Invalid image index' },
            { status: 400 }
          );
        }

        if (files.length !== 1) {
          return NextResponse.json(
            { error: 'Please provide exactly one replacement image' },
            { status: 400 }
          );
        }

        const storage = StorageFactory.getInstance();
        const oldImage = post.images[imageIndex];
        const newFile = files[0];

        try {
          const buffer = Buffer.from(await newFile.arrayBuffer());
          const result = await storage.uploadFile(buffer, newFile.name, newFile.type);

          try {
            await storage.deleteFile(oldImage.key);
          } catch (deleteError) {
            console.error(`Failed to delete old image: ${oldImage.key}`, deleteError);
          }

          post.images[imageIndex] = {
            url: result.url,
            key: result.key,
            thumbnailUrl: result.thumbnailUrl,
            name: result.name,
            size: result.size,
            contentType: result.contentType,
            width: result.width,
            height: result.height,
            etag: result.etag,
            storageType: result.storageType,
            isThumbnail: false
          };

          await post.save();
          await post.populate('uploadedBy', 'username');

          return NextResponse.json({
            message: 'Image replaced successfully',
            post
          }, { status: 200 });

        } catch (uploadError) {
          return NextResponse.json(
            { error: `Failed to replace image: ${uploadError.message}` },
            { status: 500 }
          );
        }
      }
    }

    const body = await request.json();

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
