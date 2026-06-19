import express from 'express';
import { addSkill, updateSkill, listSkills, removeSkill } from '../controllers/skillController.js';
import adminAuth from '../middleware/adminAuth.js';

const skillRouter = express.Router();

skillRouter.get('/list', listSkills);
skillRouter.post('/add', adminAuth, addSkill);
skillRouter.post('/update', adminAuth, updateSkill);
skillRouter.post('/remove', adminAuth, removeSkill);

export default skillRouter;
