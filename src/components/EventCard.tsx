
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  price: string;
  category: string;
  attendees: number;
  vibeScore?: number;
}

interface EventCardProps {
  event: Event;
  index: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-card overflow-hidden h-full flex flex-col"
    >
      <Link to={`/event/${event.id}`} className="block h-full">
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-3 left-3 z-20">
            <span className="category-chip bg-white/90 backdrop-blur-sm text-foreground">
              {event.category}
            </span>
          </div>
          <div className="absolute bottom-3 right-3 z-20">
            <span className="category-chip bg-primary text-white font-medium">
              ₹{event.price}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-lg line-clamp-1 mb-2">{event.title}</h3>
          <p className="text-foreground/70 text-sm line-clamp-2 mb-4">{event.description}</p>
          
          <div className="flex flex-col space-y-2 text-sm text-foreground/70 mt-auto">
            <div className="flex items-center">
              <Calendar size={14} className="mr-2" />
              <span>{event.date} · {event.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin size={14} className="mr-2" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center">
              <Users size={14} className="mr-2" />
              <span>{event.attendees} attending</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
