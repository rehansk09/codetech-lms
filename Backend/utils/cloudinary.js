const cloudinary = require("cloudinary").v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary configuration is incomplete. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
});

// Set uploads folder path relative to your project
const uploadFolder = path.join(__dirname, 'uploads');

// Check if the uploads folder exists, create it if it doesn't
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// Multer setup for file upload
const upload = multer({
    dest: uploadFolder // Use relative path here
});

// Upload media to Cloudinary
const uploadMediaToCloudinary = async (file) => {
    try {
        const res = await cloudinary.uploader.upload(file, {
            resource_type: 'auto',
            transformation: [{
                quality: 'auto',
                fetch_format: 'auto'
            }]
        });
        return res;
    } catch (error) {
        console.error("Upload Cloudinary Error:", {
            httpCode: error.http_code || error.status || null,
            providerCode: error.error?.code || null,
            providerMessage: error.error?.message || error.message,
        });
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
}

// Delete media from Cloudinary
const deleteMediaFromCloudinary = async (id) => {
    try {
        const res = await cloudinary.uploader.destroy(id, {
            resource_type: 'video'
        });
        return res;
    } catch (error) {
        console.error("Delete from Cloudinary Error:", error.message);
        throw new Error(`Cloudinary deletion failed: ${error.message}`);
    }
}

module.exports = { upload, deleteMediaFromCloudinary, uploadMediaToCloudinary };
