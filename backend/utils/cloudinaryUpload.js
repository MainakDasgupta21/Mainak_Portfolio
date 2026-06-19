import { v2 as cloudinary } from "cloudinary"

// Streams an in-memory multer file (`file.buffer`) into Cloudinary.
// Used instead of `cloudinary.uploader.upload(file.path, ...)` because
// multer now uses memoryStorage (no file is written to disk).
const uploadBufferToCloudinary = (file, options = {}) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) return reject(error)
            resolve(result)
        })
        stream.end(file.buffer)
    })

export default uploadBufferToCloudinary
