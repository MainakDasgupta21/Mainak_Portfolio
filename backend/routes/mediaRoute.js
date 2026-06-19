import express from 'express';
import { uploadMedia, listMedia, removeMedia } from '../controllers/mediaController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const mediaRouter = express.Router();

mediaRouter.post('/upload', adminAuth, upload.single('file'), uploadMedia);
mediaRouter.post('/list', adminAuth, listMedia);
mediaRouter.post('/remove', adminAuth, removeMedia);

export default mediaRouter;
