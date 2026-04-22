import apiClient from './apiClient';

export interface WorkerProfile {
  id: number;
  userId: number;
  displayName: string;
  bio: string;
  skills: string[];
  experienceYears: number;
  rating: number;
  isAvailable: boolean;
  completedJobsCount: number;
  trade?: string;
  location?: string;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  createdAt: string;
  updatedAt: string;
}

export interface WorkerProfileRequest {
  bio: string;
  skills: string[];
  experienceYears: number;
  trade?: string;
  location?: string;
  isAvailable?: boolean;
  verificationStatus?: 'unverified' | 'pending' | 'verified';
}

export const getWorkerProfile = async (userId: number): Promise<WorkerProfile> => {
  const response = await apiClient.get<WorkerProfile>(`/workers/${userId}/profile`);
  return response.data;
};

export const createOrUpdateProfile = async (profileData: WorkerProfileRequest): Promise<WorkerProfile> => {
  const response = await apiClient.post<WorkerProfile>('/workers/profile', profileData);
  return response.data;
};
