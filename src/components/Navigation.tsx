
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Search, MapPin, User, LogOut, Plus, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import Logo from './Logo';
import { useAuth } from '@/contexts/AuthContext';
import NotificationCenter from './NotificationCenter';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, profile, isAdmin, signOut } = useAuth();

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Create nav items based on user role
  const getNavItems = () => {
    const baseItems = [
      { name: 'Events', path: '/' },
    ];
    
    const userItems = [
      { name: 'My Tickets', path: '/tickets', authRequired: true },
    ];
    
    const adminItems = [
      { name: 'Create Event', path: '/create-event', adminRequired: true },
    ];
    
    let items = [...baseItems, ...userItems];
    
    if (isAdmin) {
      items = [...items, ...adminItems];
    }
    
    return items;
  };
  
  const navItems = getNavItems();

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 ${
        isScrolled ? 'py-3 backdrop-blur-md bg-background/80 shadow-subtle' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Logo className="z-10" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems
            .filter(item => 
              (!item.authRequired && !item.adminRequired) || 
              (item.authRequired && user) || 
              (item.adminRequired && isAdmin)
            )
            .map((item) => (
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
          
          {user && <NotificationCenter />}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || "User"} />
                    <AvatarFallback>
                      {profile?.full_name ? getInitials(profile.full_name) : <User size={16} />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium">{profile?.full_name || "SpotMe User"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  {isAdmin && (
                    <span className="text-xs font-semibold text-primary">Administrator</span>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/tickets" className="cursor-pointer">
                    <Ticket className="mr-2 h-4 w-4" />
                    <span>My Tickets</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/create-event" className="cursor-pointer">
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Create Event</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500 cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="outline" className="ml-2 button-hover">
                Sign In
              </Button>
            </Link>
          )}
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
              {navItems
                .filter(item => 
                  (!item.authRequired && !item.adminRequired) || 
                  (item.authRequired && user) || 
                  (item.adminRequired && isAdmin)
                )
                .map((item) => (
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
              
              {user && (
                <Link
                  to="/profile"
                  className={`block py-3 px-4 rounded-lg ${
                    location.pathname === '/profile'
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-accent/50'
                  }`}
                >
                  My Profile
                </Link>
              )}
              
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <Button variant="outline" size="sm" className="w-full">
                  <Search size={16} className="mr-2" />
                  Search
                </Button>
                
                {user ? (
                  <Button variant="outline" size="sm" className="w-full ml-2" onClick={() => signOut()}>
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <Link to="/auth" className="w-full ml-2">
                    <Button className="w-full">
                      <User size={16} className="mr-2" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
