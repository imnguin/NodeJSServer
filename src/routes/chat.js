import express from 'express';
import { chatContronller } from '../controllers/chatContronller.js';

const router = express.Router();
const path = '/api/chat';

router.post('/saveChat', chatContronller.saveChat);
router.post('/loadChatsByUser', chatContronller.loadChatsByUser);
router.post('/loadMessageByChatId', chatContronller.loadMessageByChatId);

export const chatRouter = {
    path,
    router
}