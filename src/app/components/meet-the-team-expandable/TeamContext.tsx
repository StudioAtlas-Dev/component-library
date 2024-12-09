'use client'

import { createContext, useContext, useState } from 'react';

interface TeamContextType {
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  isAnyExpanded: boolean;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider = ({ children }: { children: React.ReactNode }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  return (
    <TeamContext.Provider value={{ 
      expandedId, 
      setExpandedId,
      isAnyExpanded: expandedId !== null 
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