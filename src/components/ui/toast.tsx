'use client'

import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  duration?: number;
}

export const Toast = ({ message, type, duration = 3000 }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed top-4 right-4 z-[100]
        px-6 py-3 rounded-lg shadow-lg
        transform transition-all duration-300
        ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}
        text-white
        animate-in fade-in slide-in-from-top-4
        pointer-events-none
      `}
    >
      {message}
    </div>
  );
};

export const showToast = (message: string, type: 'success' | 'error') => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);
  
  const root = createRoot(container);
  root.render(<Toast message={message} type={type} />);
  
  setTimeout(() => {
    root.unmount();
    container.remove();
  }, 3000);
}; 