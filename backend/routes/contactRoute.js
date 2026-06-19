import express from 'express';
import { submitContact, listContacts, removeContact, markContactRead } from '../controllers/contactController.js';
import adminAuth from '../middleware/adminAuth.js';

const contactRouter = express.Router();

contactRouter.post('/submit', submitContact);          // PUBLIC
contactRouter.post('/list', adminAuth, listContacts);  // admin
contactRouter.post('/remove', adminAuth, removeContact);
contactRouter.post('/status', adminAuth, markContactRead);

export default contactRouter;
