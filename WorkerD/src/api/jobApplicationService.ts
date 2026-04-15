import apiClient from './apiClient';

export interface JobApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  workerId: number;
  workerName: string;
  bidAmount: number;
  coverLetter: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  createdAt: string;
  updatedAt: string;
}

export interface JobApplicationRequest {
  bidAmount: number;
  coverLetter: string;
}

export const applyForJob = async (jobId: number, data: JobApplicationRequest): Promise<JobApplication> => {
  const response = await apiClient.post<JobApplication>(`/jobs/${jobId}/apply`, data);
  return response.data;
};

export const getApplicationsForJob = async (jobId: number): Promise<JobApplication[]> => {
  const response = await apiClient.get<JobApplication[]>(`/jobs/${jobId}/applications`);
  return response.data;
};

export const getMyApplications = async (): Promise<JobApplication[]> => {
  const response = await apiClient.get<JobApplication[]>('/applications/my');
  return response.data;
};

export const updateApplicationStatus = async (applicationId: number, status: JobApplication['status']): Promise<JobApplication> => {
  const response = await apiClient.patch<JobApplication>(`/applications/${applicationId}/status`, null, {
    params: { status }
  });
  return response.data;
};

export const getApplicantCount = async (): Promise<number> => {
  const response = await apiClient.get<number>('/applications/stats/count');
  return response.data;
};

export const getShortlistedCount = async (): Promise<number> => {
  const response = await apiClient.get<number>('/applications/stats/shortlisted/count');
  return response.data;
};
