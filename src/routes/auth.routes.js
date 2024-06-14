import express from 'express';
import { signup, register, login, logout } from '../controllers/auth.controller.js';
import { isAuthenticatedCompany } from '../middleware/auth.middlewares.js';

const router = express.Router();

router.post('/register', register);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', isAuthenticatedCompany, logout);

export default router;


