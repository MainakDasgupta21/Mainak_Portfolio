import express from 'express';
import { addEducation, updateEducation, listEducation, removeEducation } from '../controllers/educationController.js';
import adminAuth from '../middleware/adminAuth.js';

const educationRouter = express.Router();

educationRouter.get('/list', listEducation);
educationRouter.post('/add', adminAuth, addEducation);
educationRouter.post('/update', adminAuth, updateEducation);
educationRouter.post('/remove', adminAuth, removeEducation);

export default educationRouter;
