import apiClient from './apiClient';

export interface Job {
  id: number;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  latitude?: number;
  longitude?: number;
  status: string;
  hirerId: number;
  hirerName: string;
  workerId?: number;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export const getJobs = async (): Promise<Job[]> => {
  const response = await apiClient.get<Job[]>('/jobs');
  return response.data;
};

export const getMyJobs = async (): Promise<Job[]> => {
  const response = await apiClient.get<Job[]>('/jobs/my-jobs');
  return response.data;
};

export const getJobById = async (id: number): Promise<Job> => {
  const response = await apiClient.get<Job>(`/jobs/${id}`);
  return response.data;
};

export const createJob = async (jobData: Partial<Job>): Promise<Job> => {
  const response = await apiClient.post<Job>('/jobs', jobData);
  return response.data;
};

export const updateJobStatus = async (id: number, status: string): Promise<Job> => {
  const response = await apiClient.patch<Job>(`/jobs/${id}/status`, null, {
    params: { status }
  });
  return response.data;
};
