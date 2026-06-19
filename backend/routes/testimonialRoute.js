import express from 'express';
import { addTestimonial, updateTestimonial, listTestimonials, removeTestimonial } from '../controllers/testimonialController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const testimonialRouter = express.Router();

const imageField = upload.fields([{ name: 'image', maxCount: 1 }]);

testimonialRouter.get('/list', listTestimonials);
testimonialRouter.post('/add', adminAuth, imageField, addTestimonial);
testimonialRouter.post('/update', adminAuth, imageField, updateTestimonial);
testimonialRouter.post('/remove', adminAuth, removeTestimonial);

export default testimonialRouter;
