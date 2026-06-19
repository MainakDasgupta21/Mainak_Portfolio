import multer from "multer";

// Memory storage keeps each upload in `file.buffer` instead of writing to disk.
// Required on serverless hosts (e.g. Vercel) whose filesystem is read-only.
// The buffer is streamed straight into Cloudinary via `uploadBufferToCloudinary`.
const storage = multer.memoryStorage()

const upload = multer({ storage })

export default upload
