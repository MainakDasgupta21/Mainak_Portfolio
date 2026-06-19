import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import adminAuth from '../middleware/adminAuth.js';

const profileRouter = express.Router();

profileRouter.get('/', getProfile);
profileRouter.post('/update', adminAuth, updateProfile);

export default profileRouter;
