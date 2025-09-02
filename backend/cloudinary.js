const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Log configuration to verify it's loaded correctly (remove in production)
console.log("Cloudinary Configuration:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ Missing",
  api_key: process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ Missing", 
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Missing"
});

exports.uploads = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      {
        resource_type: "auto",
        folder: "Image"
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve({
            url: result.url,
            id: result.public_id
          });
        }
      }
    );
  });
};