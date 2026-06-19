import express from 'express';
import { addExperience, updateExperience, listExperience, removeExperience } from '../controllers/experienceController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const experienceRouter = express.Router();

const logoField = upload.fields([{ name: 'logo', maxCount: 1 }]);

experienceRouter.get('/list', listExperience);
experienceRouter.post('/add', adminAuth, logoField, addExperience);
experienceRouter.post('/update', adminAuth, logoField, updateExperience);
experienceRouter.post('/remove', adminAuth, removeExperience);

export default experienceRouter;
