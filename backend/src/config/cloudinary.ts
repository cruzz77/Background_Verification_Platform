import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer directly to Cloudinary as a raw PDF resource.
 * Returns the secure URL of the uploaded document.
 */
export const uploadPDF = (fileBuffer: Buffer, filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('[Cloudinary] Configuration credentials missing. Mocking upload url.');
      return resolve(`https://res.cloudinary.com/mock-cloud/raw/upload/v123456/${filename}.pdf`);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'vshield_reports',
        public_id: filename,
        resource_type: 'raw',
        access_mode: 'public',
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary] Upload failed:', error);
          return reject(error);
        }
        resolve(result?.secure_url || '');
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;
