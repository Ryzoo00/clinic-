import React, { useEffect, useState, useRef } from 'react';
import api from '../../api/axios';
import { Send, Bot, User, MessageSquare, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/api/chat');
      setMessages(data.data || data);
    } catch (error) {
      // Silent fail for initial load
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput('');

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data } = await api.post('/api/chat', { message: userMessage });
      setMessages(prev => [...prev, { role: 'assistant', content: data.data?.response || data.response || data.message }]);
    } catch (error) {
      toast.error('Failed to send message');
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-medical-600 to-medical-800 rounded-t-2xl p-4 md:p-6 overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">AI Health Assistant</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-xs text-medical-200">Online</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-medical-300" />
            <span className="text-xs text-medical-200">AI Powered</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl border-l border-r border-gray-100/50 dark:border-dark-700/50">
        <div className="p-4 md:p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-medical-50 to-medical-100 dark:from-medical-900/20 dark:to-medical-900/10 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-medical-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-2">Start a conversation with your AI assistant</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Ask about symptoms, appointments, or general health questions</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-medical-500 to-medical-600'
                  : 'bg-gradient-to-br from-violet-500 to-violet-600'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-medical-500 to-medical-600 text-white shadow-lg shadow-medical-500/20 rounded-tr-sm'
                  : 'bg-gray-50 dark:bg-dark-700/50 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-dark-700 rounded-tl-sm'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-50 dark:bg-dark-700/50 border border-gray-100 dark:border-dark-700 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-b-2xl border border-gray-100/50 dark:border-dark-700/50 p-4 shrink-0">
        <form onSubmit={sendMessage} className="flex gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-gradient-to-r from-medical-500 to-medical-600 text-white rounded-xl font-medium hover:from-medical-600 hover:to-medical-700 shadow-lg shadow-medical-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
