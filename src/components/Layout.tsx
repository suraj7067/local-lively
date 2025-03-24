
import React, { ReactNode, useEffect, useState } from 'react';
import Navigation from './Navigation';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // We'll use a try-catch to safely use useLocation and provide a fallback
  let location;
  try {
    location = useLocation();
  } catch (error) {
    // If useLocation fails, we'll use a default value
    location = { pathname: '/' };
  }

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  const variants = {
    initial: { opacity: 0, y: 8 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <div
        className="spotlight"
        style={{
          '--x': `${mousePosition.x}px`,
          '--y': `${mousePosition.y}px`,
          '--size': '35rem',
          '--blur': '8rem',
          opacity: 0.15,
        } as React.CSSProperties}
      />
      
      <Navigation />
      
      <motion.main
        key={location.pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="container px-4 sm:px-6 mx-auto pt-20 pb-16 font-sans"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;
