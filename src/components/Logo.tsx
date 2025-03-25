
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'default' | 'white';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'default', className = '' }) => {
  // Use different logo images based on the variant
  // Adding key timestamp parameter to avoid caching issues
  const logoSrc = variant === 'white' 
    ? '/lovable-uploads/2bb0f86b-d091-4fd9-9bc9-52c239c942e0.png' 
    : '/lovable-uploads/8753fde5-88dc-4bd3-91bc-253af74e9628.png';
  
  return (
    <Link to="/" className={`inline-block ${className}`}>
      <img 
        src={logoSrc} 
        alt="SpotVibe Logo" 
        className="h-8 sm:h-10"
        onError={(e) => {
          console.error("Logo failed to load:", e);
          // Fallback to text if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement?.insertAdjacentHTML(
            'beforeend', 
            '<span class="font-bold text-xl tracking-tight">Spot<span class="text-primary">Vibe</span></span>'
          );
        }}
      />
    </Link>
  );
};

export default Logo;
