import { v2 as cloudinary } from 'cloudinary';


const uploadOnCloudinary = async (file: Blob | null): Promise<string | null> => {
  if (!file) return null;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'nextproject' // Your new folder setting
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          reject(error);
        } else {
          resolve(result?.secure_url || null);
        }
      }
    );

    // CRITICAL: This line actually sends the data
    uploadStream.end(buffer);
  });
};

export default uploadOnCloudinary;