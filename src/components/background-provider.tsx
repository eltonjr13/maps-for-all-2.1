"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';

interface BackgroundContextType {
  isAnimating: boolean;
  toggleAnimation: () => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [isAnimating, setIsAnimating] = useState(true);

  const toggleAnimation = () => {
    setIsAnimating(prev => !prev);
  };

  const value = useMemo(() => ({ isAnimating, toggleAnimation }), [isAnimating]);

  return (
    <BackgroundContext.Provider value={value}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}
