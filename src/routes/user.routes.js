import express from 'express';
import { getAllUsers } from '../controllers/UserData.controller.js';
import { isAuthenticatedCompany } from '../middleware/auth.middlewares.js';


const router = express.Router();

router.get('/users' , isAuthenticatedCompany , getAllUsers)

export default router;