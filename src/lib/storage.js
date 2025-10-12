import imagekit from './imagekit';
import r2 from './r2';

class StorageFactory {
  static getInstance() {
    const mode = process.env.GALLERY_STORAGE_MODE?.toLowerCase() || 'r2';
    
    switch (mode) {
      case 'imgkit':
      case 'imagekit':
        return new ImageKitAdapter();
      case 'r2':
      case 'cloudflare':
        return new CloudflareR2Adapter();
      default:
        throw new Error(`Unsupported storage mode: ${mode}`);
    }
  }
}

class StorageAdapter {
  async uploadFile({ buffer, fileName, contentType, folder = '' }) {
    throw new Error('uploadFile must be implemented');
  }

  async deleteFile(identifier) {
    throw new Error('deleteFile must be implemented');
  }

  getStorageInfo() {
    throw new Error('getStorageInfo must be implemented');
  }
}

class ImageKitAdapter extends StorageAdapter {
  async uploadFile({ buffer, fileName, contentType, folder = '' }) {
    try {
      const folderPath = folder ? `/${folder}` : '/nkpol_dev/gallery';
      
      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: fileName,
        folder: folderPath,
        useUniqueFileName: true,
        tags: ['gallery', 'nkpol_dev']
      });

      return {
        url: uploadResponse.url,
        thumbnailUrl: uploadResponse.url,
        key: uploadResponse.fileId,
        fileId: uploadResponse.fileId,
        name: uploadResponse.name,
        size: uploadResponse.size,
        width: uploadResponse.width,
        height: uploadResponse.height,
        etag: uploadResponse.fileId,
        storageType: 'imagekit'
      };
    } catch (error) {
      console.error('ImageKit Upload Error:', error);
      throw new Error(`Failed to upload to ImageKit: ${error.message}`);
    }
  }

  async deleteFile(fileId) {
    try {
      await imagekit.deleteFile(fileId);
      return { success: true };
    } catch (error) {
      console.error('ImageKit Delete Error:', error);
      throw new Error(`Failed to delete from ImageKit: ${error.message}`);
    }
  }

  getStorageInfo() {
    return {
      type: 'imagekit',
      endpoint: process.env.IMGKIT_ENDPOINTURL,
      folder: 'nkpol_dev/gallery'
    };
  }
}

class CloudflareR2Adapter extends StorageAdapter {
  async uploadFile({ buffer, fileName, contentType, folder = '' }) {
    try {
      const uploadResponse = await r2.uploadFile({
        buffer,
        fileName,
        contentType,
        folder: folder || 'nkpol_dev/gallery'
      });

      return {
        ...uploadResponse,
        storageType: 'r2'
      };
    } catch (error) {
      console.error('R2 Upload Error:', error);
      throw new Error(`Failed to upload to R2: ${error.message}`);
    }
  }

  async deleteFile(key) {
    try {
      await r2.deleteFile(key);
      return { success: true };
    } catch (error) {
      console.error('R2 Delete Error:', error);
      throw new Error(`Failed to delete from R2: ${error.message}`);
    }
  }

  getStorageInfo() {
    return {
      type: 'r2',
      endpoint: process.env.R2_PUBLIC_URL,
      bucket: process.env.R2_BUCKET_NAME,
      folder: 'nkpol_dev/gallery'
    };
  }
}

export default StorageFactory;