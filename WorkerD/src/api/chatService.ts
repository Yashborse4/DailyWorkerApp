import apiClient from './apiClient';

export interface ChatRoom {
  id: number;
  workerId: number;
  hirerId: number;
  lastMessage?: string;
  workerName: string;
  hirerName: string;
}

export interface ChatMessage {
  id: string;
  chatRoomId: number;
  content: string;
  senderId: number;
  status: 'SENT' | 'DELIVERED' | 'READ';
  createdAt: string;
}

export const sendMessage = async (roomId: number, content: string): Promise<ChatMessage> => {
  const response = await apiClient.post<ChatMessage>(`/chat/rooms/${roomId}/messages`, content);
  return response.data;
};

export const getUnreadCount = async (): Promise<{ count: number }> => {
  const response = await apiClient.get<{ count: number }>('/chat/unread-count');
  return response.data;
};

export const sendTypingIndicator = async (roomId: number, isTyping: boolean): Promise<void> => {
  await apiClient.post(`/chat/rooms/${roomId}/typing`, null, {
    params: { isTyping }
  });
};

export const getRooms = async (): Promise<ChatRoom[]> => {
  const response = await apiClient.get<ChatRoom[]>('/chat/rooms');
  return response.data;
};

export const getMessages = async (roomId: number): Promise<ChatMessage[]> => {
  const response = await apiClient.get<ChatMessage[]>(`/chat/rooms/${roomId}/messages`);
  return response.data;
};

export const getOrCreateRoom = async (targetUserId: number): Promise<ChatRoom> => {
  const response = await apiClient.post<ChatRoom>('/chat/rooms', null, {
    params: { targetUserId }
  });
  return response.data;
};
