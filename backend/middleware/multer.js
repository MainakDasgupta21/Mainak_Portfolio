import multer from "multer";

// Disk storage mirrors Forever's `middleware/multer.js`.
// NOTE for production: Vercel's serverless filesystem is read-only outside
// /tmp, so swap to `multer.memoryStorage()` (and stream `file.buffer` into
// `cloudinary.uploader.upload_stream`) before deploying to Vercel.
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + "-" + file.originalname)
    }
})

const upload = multer({ storage })

export default upload
