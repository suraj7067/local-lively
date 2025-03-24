
import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section className="py-16 md:py-24">
      <motion.div 
        className="text-center max-w-3xl mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <motion.div variants={itemVariants} className="mb-2">
          <span className="category-chip bg-primary/10 text-primary">Discover local events</span>
        </motion.div>
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
          variants={itemVariants}
        >
          Find your next <span className="text-primary">experience</span>
        </motion.h1>
        <motion.p 
          className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Explore and connect with local events happening around you. From DJ nights to stand-up comedy, find the perfect vibe for your weekend.
        </motion.p>
        
        <motion.div 
          className="relative max-w-md mx-auto"
          variants={itemVariants}
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-foreground/50" />
          </div>
          <Input 
            type="text" 
            placeholder="Search for events, venues, or categories"
            className="pl-10 pr-20 py-6 h-auto text-base rounded-xl border border-border/70 shadow-subtle"
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <Button size="sm" className="button-hover">Search</Button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
