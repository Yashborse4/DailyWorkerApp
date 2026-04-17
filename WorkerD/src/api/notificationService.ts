import apiClient from './apiClient';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await apiClient.get<Notification[]>('/notifications');
  return response.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await apiClient.get<number>('/notifications/unread-count');
  return response.data;
};

export const markAsRead = async (id: number): Promise<void> => {
  await apiClient.post(`/notifications/${id}/read`);
};
