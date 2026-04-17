import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, ChatRoom } from '../types';
import { useAuth } from './AuthContext';
import * as chatService from '../api/chatService';

interface ChatContextType {
  rooms: any[];
  activeRoom: any | null;
  setActiveRoomId: (id: number | null) => void;
  sendMessage: (roomId: number, text: string) => void;
  markAsRead: (roomId: number) => void;
  loading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (profile?.id) {
      fetchRooms();
    }
  }, [profile?.id]);

  useEffect(() => {
    if (activeRoomId) {
      fetchMessages(activeRoomId);
    } else {
      setMessages([]);
    }
  }, [activeRoomId]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await chatService.getRooms();
      setRooms(data.map(r => ({
        ...r,
        messages: r.id === activeRoomId ? messages : []
      })));
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId: number) => {
    try {
      const msgs = await chatService.getMessages(roomId);
      setMessages(msgs.map(m => ({
        id: m.id,
        senderId: m.senderId,
        text: m.content,
        timestamp: m.timestamp,
        status: m.status.toLowerCase()
      })));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const activeRoom = rooms.find(r => r.id === activeRoomId) 
    ? { ...rooms.find(r => r.id === activeRoomId), messages } 
    : null;

  const setActiveRoomIdAndClearUnread = (id: number | null) => {
    setActiveRoomId(id);
    if (id) markAsRead(id);
  };

  const sendMessage = async (roomId: number, text: string) => {
    if (!profile?.id) return;

    try {
      await chatService.sendMessage(roomId, text);
      fetchMessages(roomId); // Refresh history
      fetchRooms(); // Refresh last message in list
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const receiveMockResponse = (roomId: string) => {
    // This will be replaced by WebSocket or Polling in a real implementation
  };

  const markAsRead = (roomId: number) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return { ...room, unreadCount: 0 };
      }
      return room;
    }));
  };

  return (
    <ChatContext.Provider value={{ 
        rooms, 
        setActiveRoomId: setActiveRoomIdAndClearUnread, 
        sendMessage, 
        markAsRead,
        loading
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
