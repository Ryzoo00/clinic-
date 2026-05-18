import Chat from '../models/Chat.js';
import User from '../models/User.js';

// Get or create chat between two users
export const getOrCreateChat = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    // Find existing chat
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate('participants', 'name email role');

    // Create new chat if doesn't exist
    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId]
      });
      chat = await Chat.findById(chat._id).populate('participants', 'name email role');
    }

    res.json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get all chats for current user
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      participants: userId
    })
      .populate('participants', 'name email role')
      .sort({ lastMessageAt: -1 });

    res.json({ success: true, count: chats.length, data: chats });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

    if (!message || !receiverId) {
      return res.status(400).json({ error: 'Message and receiverId are required' });
    }

    // Find or create chat
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId]
      });
    }

    // Add message
    const newMessage = {
      senderId,
      receiverId,
      message: message.trim()
    };

    chat.messages.push(newMessage);
    chat.lastMessage = message.trim();
    chat.lastMessageAt = new Date();

    await chat.save();

    // Populate and return
    chat = await Chat.findById(chat._id).populate('participants', 'name email role');

    res.status(201).json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get messages in a chat
export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId)
      .populate('messages.senderId', 'name email role')
      .populate('messages.receiverId', 'name email role');

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.toString() === userId.toString());
    if (!isParticipant) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Mark messages as read
    chat.messages.forEach(msg => {
      if (msg.receiverId.toString() === userId.toString()) {
        msg.isRead = true;
      }
    });
    await chat.save();

    res.json({ success: true, data: chat.messages });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Mark messages as read
    let updated = 0;
    chat.messages.forEach(msg => {
      if (msg.receiverId.toString() === userId.toString() && !msg.isRead) {
        msg.isRead = true;
        updated++;
      }
    });

    if (updated > 0) {
      await chat.save();
    }

    res.json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      participants: userId
    });

    let totalUnread = 0;
    chats.forEach(chat => {
      chat.messages.forEach(msg => {
        if (msg.receiverId.toString() === userId.toString() && !msg.isRead) {
          totalUnread++;
        }
      });
    });

    res.json({ success: true, unreadCount: totalUnread });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
