import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, ChatRoom } from '../types';
import { useAuth } from './AuthContext';

interface ChatContextType {
  rooms: ChatRoom[];
  activeRoom: ChatRoom | null;
  setActiveRoomId: (id: string | null) => void;
  sendMessage: (roomId: string, text: string) => void;
  markAsRead: (roomId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>(MOCK_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  const activeRoom = rooms.find(r => r.id === activeRoomId) || null;

  const setActiveRoomIdAndClearUnread = (id: string | null) => {
    setActiveRoomId(id);
    if (id) markAsRead(id);
  };

  const sendMessage = (roomId: string, text: string) => {
    if (!profile?.id) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: profile.id,
      text,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          messages: [...room.messages, newMessage],
          lastMessage: newMessage,
        };
      }
      return room;
    }));

    // Mock response from other user
    setTimeout(() => {
        receiveMockResponse(roomId);
    }, 2000);
  };

  const receiveMockResponse = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const responseMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      senderId: room.participants.find(p => p !== profile?.id) || 'system',
      text: "Thanks for the message! I'll get back to you soon.",
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        return {
          ...r,
          messages: [...r.messages, responseMessage],
          lastMessage: responseMessage,
          unreadCount: activeRoomId === roomId ? 0 : r.unreadCount + 1,
        };
      }
      return r;
    }));
  };

  const markAsRead = (roomId: string) => {
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
        activeRoom, 
        setActiveRoomId: setActiveRoomIdAndClearUnread, 
        sendMessage, 
        markAsRead 
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

// --- MOCK DATA ---

const MOCK_ROOMS: ChatRoom[] = [
  {
    id: '1',
    participants: ['user_id', 'worker_1'],
    otherUserName: 'Rajesh Kumar',
    unreadCount: 2,
    lastMessage: {
      id: 'm1',
      senderId: 'worker_1',
      text: 'Is the site open tomorrow?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'sent',
    },
    messages: [
      {
        id: 'm0',
        senderId: 'user_id',
        text: 'Hi Rajesh, I saw your application.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'read',
      },
      {
        id: 'm1',
        senderId: 'worker_1',
        text: 'Is the site open tomorrow?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'sent',
      }
    ]
  },
  {
    id: '2',
    participants: ['user_id', 'hirer_1'],
    otherUserName: 'Skyline Infra',
    unreadCount: 0,
    lastMessage: {
      id: 'm2',
      senderId: 'hirer_1',
      text: 'Your document verification is pending.',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'read',
    },
    messages: [
      {
        id: 'm2',
        senderId: 'hirer_1',
        text: 'Your document verification is pending.',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'read',
      }
    ]
  }
];
