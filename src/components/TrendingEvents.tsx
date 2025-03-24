
import React from 'react';
import EventCard, { Event } from './EventCard';
import { motion } from 'framer-motion';

const TrendingEvents: React.FC = () => {
  // Sample data for events
  const events: Event[] = [
    {
      id: '1',
      title: 'Electric Nights: DJ Aurora Live',
      description: 'Experience the incredible beats of DJ Aurora with a stunning visual show and energetic atmosphere.',
      date: 'Sat, Nov 5',
      time: '9:00 PM',
      location: 'Skyline Club, Lower Parel',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
      price: '499',
      category: 'DJ Night',
      attendees: 154,
      vibeScore: 9.2
    },
    {
      id: '2',
      title: 'Laugh Out Loud: Comedy Night',
      description: 'Join us for a night of non-stop laughter with the city\'s best stand-up comedians taking the stage.',
      date: 'Fri, Nov 11',
      time: '8:00 PM',
      location: 'The Comedy Club, Bandra',
      imageUrl: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
      price: '349',
      category: 'Stand-up',
      attendees: 87,
      vibeScore: 8.7
    },
    {
      id: '3',
      title: 'Acoustic Evening with The Harmonics',
      description: 'A soulful evening featuring The Harmonics performing their original compositions and acoustic covers.',
      date: 'Sun, Nov 13',
      time: '7:30 PM',
      location: 'Blue Note Café, Andheri',
      imageUrl: 'https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
      price: '299',
      category: 'Live Music',
      attendees: 62,
      vibeScore: 8.5
    },
    {
      id: '4',
      title: 'Karaoke Night: Classics & Hits',
      description: 'Sing your heart out at the biggest karaoke night in town featuring classics and current chart-toppers.',
      date: 'Thu, Nov 10',
      time: '8:00 PM',
      location: 'Melody Lounge, Juhu',
      imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
      price: '199',
      category: 'Karaoke',
      attendees: 45,
      vibeScore: 7.9
    }
  ];

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="category-chip bg-primary/10 text-primary mb-2 inline-block"
          >
            Trending Now
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-2xl font-bold"
          >
            Popular Events
          </motion.h2>
        </div>
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-sm text-primary hover:underline font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View All
        </motion.button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </div>
    </section>
  );
};

export default TrendingEvents;
