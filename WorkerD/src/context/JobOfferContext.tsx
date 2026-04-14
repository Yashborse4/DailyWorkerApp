import React, { createContext, useContext, useState } from 'react';
import { Job } from '../types';
import { useAuth } from './AuthContext';

interface JobOfferContextType {
  activeOffer: Job | null;
  isRinging: boolean;
  receiveOffer: (offer: Job) => void;
  acceptOffer: () => void;
  rejectOffer: () => void;
}

const JobOfferContext = createContext<JobOfferContextType | undefined>(undefined);

export const JobOfferProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeOffer, setActiveOffer] = useState<Job | null>(null);
  const [isRinging, setIsRinging] = useState(false);

  const { userRole } = useAuth(); // Import useAuth if needed

  const receiveOffer = (offer: Job) => {
    // SECURITY: Only workers can receive incoming job offer rings
    if (userRole !== 'worker') {
      console.log('Offer received but ignored: User is not a worker');
      return;
    }
    
    setActiveOffer(offer);
    setIsRinging(true);
    console.log('Incoming Job Offer Ringing for Worker...');
  };

  const acceptOffer = () => {
    setIsRinging(false);
    setActiveOffer(null);
    // Handle accept logic (API call)
    console.log('Job Offer Accepted');
  };

  const rejectOffer = () => {
    setIsRinging(false);
    setActiveOffer(null);
    console.log('Job Offer Rejected');
  };

  return (
    <JobOfferContext.Provider value={{
      activeOffer,
      isRinging,
      receiveOffer,
      acceptOffer,
      rejectOffer
    }}>
      {children}
    </JobOfferContext.Provider>
  );
};

export const useJobOffer = () => {
  const context = useContext(JobOfferContext);
  if (!context) {
    throw new Error('useJobOffer must be used within a JobOfferProvider');
  }
  return context;
};
