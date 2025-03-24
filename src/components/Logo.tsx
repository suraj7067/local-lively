
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'default' | 'white';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'default', className = '' }) => {
  // Use different logo images based on the variant
  const logoSrc = variant === 'white' 
    ? '/lovable-uploads/2bb0f86b-d091-4fd9-9bc9-52c239c942e0.png' 
    : '/lovable-uploads/8753fde5-88dc-4bd3-91bc-253af74e9628.png';
  
  return (
    <Link to="/" className={`inline-block ${className}`}>
      <img 
        src={logoSrc} 
        alt="SpotMe Logo" 
        className="h-8 sm:h-10"
      />
    </Link>
  );
};

export default Logo;
