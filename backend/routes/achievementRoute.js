import express from 'express';
import { addAchievement, updateAchievement, listAchievements, removeAchievement } from '../controllers/achievementController.js';
import adminAuth from '../middleware/adminAuth.js';

const achievementRouter = express.Router();

achievementRouter.get('/list', listAchievements);
achievementRouter.post('/add', adminAuth, addAchievement);
achievementRouter.post('/update', adminAuth, updateAchievement);
achievementRouter.post('/remove', adminAuth, removeAchievement);

export default achievementRouter;
