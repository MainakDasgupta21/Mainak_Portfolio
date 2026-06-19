import mongoose from "mongoose";

// Optional registry of every asset uploaded through /api/media/upload.
// Lets the admin Media page list past uploads and copy URLs without
// rebrowsing Cloudinary.
const mediaSchema = new mongoose.Schema({
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    type: { type: String, default: "image" }, // "image" | "video" | "raw"
    originalName: { type: String, default: "" },
    bytes: { type: Number, default: 0 },
    uploadedAt: { type: Number, default: () => Date.now() },
});

const mediaModel = mongoose.models.media || mongoose.model("media", mediaSchema);

export default mediaModel;
