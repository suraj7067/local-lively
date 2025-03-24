
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Share2, Heart, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState(false);

  // Mock data for this event
  const event = {
    id: id || '1',
    title: 'Electric Nights: DJ Aurora Live',
    description: 'Experience the incredible beats of DJ Aurora with a stunning visual show and energetic atmosphere. This exclusive event brings together the best of electronic music with immersive visuals and a state-of-the-art sound system.\n\nDJ Aurora has performed at major festivals across the country and is known for creating unforgettable dance floor experiences. Get ready for a night of high energy and amazing music!',
    date: 'Saturday, November 5, 2023',
    time: '9:00 PM - 2:00 AM',
    location: 'Skyline Club, 23rd Floor, Tower One, Lower Parel, Mumbai',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
    price: '₹499',
    category: 'DJ Night',
    attendees: 154,
    organizer: 'Skyline Entertainment',
    organizerLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    vibeScore: 9.2,
    attendeeAvatars: [
      'https://i.pravatar.cc/150?img=1',
      'https://i.pravatar.cc/150?img=2',
      'https://i.pravatar.cc/150?img=3',
      'https://i.pravatar.cc/150?img=4',
      'https://i.pravatar.cc/150?img=5',
    ]
  };

  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Layout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={animationVariants}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-6">
          <Link to="/" className="text-sm text-primary/90 hover:text-primary flex items-center">
            ← Back to events
          </Link>
        </div>

        <div className="relative rounded-2xl overflow-hidden mb-8 h-80 md:h-96">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <span className="category-chip bg-primary/95 text-white mb-3 inline-block">
              {event.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{event.title}</h1>
            <div className="flex items-center text-white/90 text-sm space-x-4">
              <span className="flex items-center">
                <Calendar size={14} className="mr-1" />
                {event.date}
              </span>
              <span className="flex items-center">
                <Clock size={14} className="mr-1" />
                {event.time}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <motion.div 
              className="glass-card p-6 mb-6"
              variants={animationVariants}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold mb-4">About This Event</h2>
              <p className="text-foreground/80 mb-6 whitespace-pre-line">{event.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 border-2 border-background">
                    <AvatarImage src={event.organizerLogo} />
                    <AvatarFallback>SE</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Organized by</p>
                    <p className="text-sm text-primary">{event.organizer}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => setIsLiked(!isLiked)}>
                    <Heart size={18} className={isLiked ? "fill-red-500 text-red-500" : ""} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 size={18} />
                  </Button>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="glass-card p-6"
              variants={animationVariants}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4">Who's Going</h2>
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-4">
                  {event.attendeeAvatars.map((avatar, index) => (
                    <Avatar key={index} className="border-2 border-background">
                      <AvatarImage src={avatar} />
                      <AvatarFallback>{index + 1}</AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border-2 border-background">
                    +{event.attendees - event.attendeeAvatars.length}
                  </div>
                </div>
                <p className="text-sm text-foreground/80">
                  <span className="font-semibold text-foreground">{event.attendees} people</span> are attending this event
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-foreground/70">
                  Join this event to unlock BuzzSpot and connect with other attendees.
                </p>
              </div>
            </motion.div>
          </div>
          
          <div className="md:col-span-1">
            <motion.div 
              className="glass-card p-6 mb-6 sticky top-24"
              variants={animationVariants}
              transition={{ delay: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Price</h3>
                  <span className="font-bold text-xl">{event.price}</span>
                </div>
                <div className="text-xs text-foreground/60 mb-6">
                  Includes all taxes and fees
                </div>
                <Button className="w-full button-hover mb-3">
                  <Ticket className="mr-2 h-4 w-4" /> Book Tickets
                </Button>
                <p className="text-xs text-center text-foreground/60">
                  No cancellations or refunds available
                </p>
              </div>
              
              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex items-start">
                  <MapPin size={18} className="mr-3 text-foreground/70 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Location</h4>
                    <p className="text-sm text-foreground/70">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar size={18} className="mr-3 text-foreground/70 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Date & Time</h4>
                    <p className="text-sm text-foreground/70">{event.date}</p>
                    <p className="text-sm text-foreground/70">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users size={18} className="mr-3 text-foreground/70 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">VibeScore™</h4>
                    <div className="flex items-center">
                      <div className="bg-primary/20 text-primary font-medium text-sm px-2 py-0.5 rounded mt-1">
                        {event.vibeScore} / 10
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default EventDetail;
