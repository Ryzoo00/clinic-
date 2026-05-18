import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Send, MessageCircle, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
      // Auto-refresh messages every 3 seconds
      const interval = setInterval(() => {
        fetchMessages(selectedChat._id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const res = await api.get('/api/chat');
      setChats(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await api.get(`/api/chat/messages/${chatId}`);
      setMessages(res.data.data || []);
    } catch (error) {
      console.error('Failed to load messages');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    setSending(true);
    try {
      const receiverId = selectedChat.participants.find(
        p => p._id !== selectedChat.messages?.[0]?.senderId?._id
      )?._id;

      await api.post('/api/chat', {
        receiverId,
        message: newMessage.trim()
      });

      setNewMessage('');
      fetchMessages(selectedChat._id);
      fetchChats();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getOtherUser = (chat) => {
    // Return the participant that's not the current user
    return chat.participants.find(p => p._id !== chat.participants[0]._id) || chat.participants[0];
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-medical-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-medical-600" />
          Messages 💬
        </h1>
        <p className="text-gray-600 mt-1">Chat with doctors and patients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Chat List */}
        <div className="card overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Conversations</h2>
          
          {chats.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => {
                const otherUser = getOtherUser(chat);
                const isSelected = selectedChat?._id === chat._id;
                const unreadCount = chat.messages?.filter(
                  msg => !msg.isRead && msg.receiverId?._id === chat.participants[0]._id
                ).length || 0;

                return (
                  <div
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                      isSelected ? 'bg-medical-50 border-2 border-medical-500' : 'border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-medical-500 to-medical-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {otherUser.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {otherUser.role === 'doctor' ? 'Dr. ' : ''}{otherUser.name}
                          </h3>
                          {chat.lastMessageAt && (
                            <span className="text-xs text-gray-500 ml-2">
                              {formatTime(chat.lastMessageAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {chat.lastMessage || 'No messages yet'}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <div className="bg-medical-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2 card flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-medical-500 to-medical-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {getOtherUser(selectedChat).name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {getOtherUser(selectedChat).role === 'doctor' ? 'Dr. ' : ''}{getOtherUser(selectedChat).name}
                    </h3>
                    <p className="text-sm text-gray-600">{getOtherUser(selectedChat).email}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    // In a real app, you'd compare with current user ID from context
                    const isOwn = index % 2 === 0; // Simplified - replace with actual check

                    return (
                      <div
                        key={index}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            isOwn
                              ? 'bg-medical-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-medical-100' : 'text-gray-500'}`}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="pt-4 border-t border-gray-200 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-medium hover:from-medical-700 hover:to-medical-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
