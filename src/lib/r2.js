import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export class CloudflareR2 {
  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME;
    this.publicUrl = process.env.R2_PUBLIC_URL;
  }

  async uploadFile({ buffer, fileName, contentType, folder = '' }) {
    try {
      const key = folder ? `${folder}/${fileName}` : fileName;
      
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000', 
      });

      const result = await r2Client.send(command);
      
      const url = `${this.publicUrl}/${key}`;
      const thumbnailUrl = `${this.publicUrl}/${key}`;
      
      return {
        url,
        thumbnailUrl,
        key,
        fileId: key,
        name: fileName,
        size: buffer.length,
        etag: result.ETag?.replace(/"/g, ''),
      };
    } catch (error) {
      console.error('R2 Upload Error:', error);
      throw new Error(`Failed to upload to R2: ${error.message}`);
    }
  }

  async deleteFile(key) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await r2Client.send(command);
      return { success: true };
    } catch (error) {
      console.error('R2 Delete Error:', error);
      throw new Error(`Failed to delete from R2: ${error.message}`);
    }
  }

  async getSignedUrl(key, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
      return signedUrl;
    } catch (error) {
      console.error('R2 Signed URL Error:', error);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  generatePublicUrl(key) {
    return `${this.publicUrl}/${key}`;
  }

  generateThumbnailUrl(key, width = null, height = null) {
    return `${this.publicUrl}/${key}`;
  }
}

const r2 = new CloudflareR2();
export default r2;