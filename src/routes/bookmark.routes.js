import express from 'express';
import { bookmarkUser , deleteBookmark, getBookmarkedUsers } from '../controllers/Bookmark.controller.js';
import { isAuthenticatedCompany } from '../middleware/auth.middlewares.js';

const router = express.Router();

router.use(isAuthenticatedCompany)

router.route('/bookmark').post(bookmarkUser).get(getBookmarkedUsers).delete(deleteBookmark);

export default router;