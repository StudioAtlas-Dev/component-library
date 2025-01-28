'use client'

import { createContext, useContext, useState } from 'react';

interface TeamContextType {
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  isAnyExpanded: boolean;
  preloadImage: (url: string) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider = ({ children }: { children: React.ReactNode }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  
  const preloadImage = (url: string) => {
    if (!preloadedImages.has(url)) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
      setPreloadedImages(prev => new Set(Array.from(prev).concat(url)));
    }
  };

  return (
    <TeamContext.Provider value={{ 
      expandedId, 
      setExpandedId,
      isAnyExpanded: expandedId !== null,
      preloadImage
    }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}; 