// src/hooks/useScrollSticky.ts
import { useState, useEffect } from 'react';

export const useScrollSticky = (threshold = 80) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isSticky;
};