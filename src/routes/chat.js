import express from 'express';
import { chatContronller } from '../controllers/chatContronller.js';

const router = express.Router();
const path = '/api/chat';

router.post('/loadAllByUser', chatContronller.loadAllByUser);

export const chatRouter = {
    path,
    router
}