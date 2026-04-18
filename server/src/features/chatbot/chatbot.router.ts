import { Router } from 'express';
import { sendMessage, getMessages } from './chatbot.controller';

export const router = Router();

router.get('/', getMessages);
router.post('/', sendMessage);
