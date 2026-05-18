import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getOrCreateChat,
  getUserChats,
  sendMessage,
  getChatMessages,
  markAsRead,
  getUnreadCount
} from '../controllers/chatController.js';

const router = express.Router();

// All routes protected
router.use(protect);

// Get all chats for user
router.get('/', getUserChats);

// Get unread count
router.get('/unread', getUnreadCount);

// Get or create chat with specific user
router.get('/:receiverId', getOrCreateChat);

// Get messages in a chat
router.get('/messages/:chatId', getChatMessages);

// Mark messages as read
router.put('/:chatId/read', markAsRead);

// Send message
router.post('/', sendMessage);

export default router;
