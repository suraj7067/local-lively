
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import CategoryFilter from '@/components/CategoryFilter';
import TrendingEvents from '@/components/TrendingEvents';
import { motion } from 'framer-motion';
import { MapPin, Calendar, TrendingUp } from 'lucide-react';

const Index: React.FC = () => {
  // Dynamic spotlight effect
  useEffect(() => {
    const spotlight = document.querySelector('.spotlight') as HTMLElement;
    if (!spotlight) return;
    
    spotlight.style.opacity = '0.15';
    
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlight) {
        spotlight.style.setProperty('--x', `${e.clientX}px`);
        spotlight.style.setProperty('--y', `${e.clientY}px`);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const featureItems = [
    {
      icon: <MapPin size={20} />,
      title: "VibeRadar",
      description: "Discover events happening near you on an interactive map."
    },
    {
      icon: <Calendar size={20} />,
      title: "Local Events",
      description: "Find the best local experiences in your city."
    },
    {
      icon: <TrendingUp size={20} />,
      title: "VibeScore",
      description: "Events ranked by popularity and user engagement."
    }
  ];

  return (
    <Layout>
      <Hero />
      
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
      >
        {featureItems.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            className="glass-card p-6 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              {item.icon}
            </div>
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-foreground/70">{item.description}</p>
          </motion.div>
        ))}
      </motion.section>
      
      <CategoryFilter />
      <TrendingEvents />
    </Layout>
  );
};

export default Index;
