
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Search, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close menu when route changes
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Events', path: '/' },
    { name: 'VibeRadar', path: '/viberadar' },
    { name: 'My Tickets', path: '/tickets' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 ${
        isScrolled ? 'py-3 backdrop-blur-md bg-background/80 shadow-subtle' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center z-10">
          <span className="font-bold text-xl tracking-tight">Spot<span className="text-primary">Me</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'text-primary'
                  : 'text-foreground/80 hover:text-foreground hover:bg-accent/50'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-3 z-10">
          <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-foreground">
            <Search size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-foreground">
            <MapPin size={20} />
          </Button>
          <Link to="/auth">
            <Button variant="outline" className="ml-2 button-hover">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden rounded-md p-2 text-foreground focus:outline-none"
          aria-expanded={isOpen}
        >
          <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border"
          >
            <div className="container mx-auto py-4 px-4 sm:px-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block py-3 px-4 rounded-lg ${
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-accent/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <Button variant="outline" size="sm" className="w-full">
                  <Search size={16} className="mr-2" />
                  Search
                </Button>
                <Link to="/auth" className="w-full ml-2">
                  <Button className="w-full">
                    <User size={16} className="mr-2" />
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
