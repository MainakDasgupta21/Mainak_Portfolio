import express from 'express';
import { addProject, updateProject, listProjects, removeProject } from '../controllers/projectController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const projectRouter = express.Router();

const imageFields = upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
]);

projectRouter.get('/list', listProjects);
projectRouter.post('/add', adminAuth, imageFields, addProject);
projectRouter.post('/update', adminAuth, imageFields, updateProject);
projectRouter.post('/remove', adminAuth, removeProject);

export default projectRouter;
