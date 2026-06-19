import { v2 as cloudinary } from "cloudinary"
import mediaModel from "../models/mediaModel.js"

// Generic uploader used by the admin Media page.
// Accepts a single `file` field via multer.single("file").
// Returns the Cloudinary `secure_url` and `public_id`, and registers
// the asset in our `media` collection so the admin can browse uploads.
const uploadMedia = async (req, res) => {
    try {
        const file = req.file || req.files?.file?.[0];
        if (!file) return res.json({ success: false, message: "file is required" });

        // Detect the right Cloudinary resource type.
        const mime = file.mimetype || "";
        const resourceType = mime.startsWith("video/")
            ? "video"
            : mime.startsWith("image/")
                ? "image"
                : "raw";

        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: resourceType,
        });

        const doc = await mediaModel.create({
            url: result.secure_url,
            publicId: result.public_id,
            type: resourceType,
            originalName: file.originalname,
            bytes: result.bytes || file.size || 0,
            uploadedAt: Date.now(),
        });

        res.json({
            success: true,
            message: "Uploaded",
            url: result.secure_url,
            publicId: result.public_id,
            type: resourceType,
            media: doc,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const listMedia = async (req, res) => {
    try {
        const media = await mediaModel.find({}).sort({ uploadedAt: -1 });
        res.json({ success: true, media });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const removeMedia = async (req, res) => {
    try {
        const { id, publicId, type } = req.body;
        if (publicId) {
            try {
                await cloudinary.uploader.destroy(publicId, { resource_type: type || "image" });
            } catch (err) {
                console.log("Cloudinary destroy failed:", err?.message);
            }
        }
        if (id) await mediaModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Media Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { uploadMedia, listMedia, removeMedia };
