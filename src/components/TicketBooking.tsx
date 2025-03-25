
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Ticket } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface TicketBookingProps {
  eventId: string;
  eventTitle: string;
  price: number;
  capacity?: number;
  currentAttendees: number;
}

const TicketBooking: React.FC<TicketBookingProps> = ({ 
  eventId, 
  eventTitle, 
  price, 
  capacity,
  currentAttendees
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);
  const [hasTicket, setHasTicket] = useState(false);

  // Check if user already has a ticket for this event
  React.useEffect(() => {
    if (!user) return;

    const checkTicket = async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (data) {
        setHasTicket(true);
      }
    };

    checkTicket();
  }, [user, eventId]);

  const generateQRCode = () => {
    // In a real app, you'd use a more sophisticated approach
    // This is a simple implementation for demo purposes
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `${eventId}-${user?.id}-${randomStr}`;
  };

  const bookTicket = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book tickets",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (capacity && currentAttendees >= capacity) {
      toast({
        title: "Sold Out",
        description: "Sorry, this event is at full capacity",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsBooking(true);

      // Create a ticket in the database
      const { error } = await supabase
        .from('tickets')
        .insert({
          event_id: eventId,
          user_id: user.id,
          qr_code: generateQRCode(),
          price_paid: price,
          is_used: false
        });

      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation - user already has a ticket
          toast({
            title: "Already booked",
            description: "You already have a ticket for this event",
          });
          setHasTicket(true);
          return;
        }
        throw error;
      }

      // Create notification
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: "Ticket Booked",
        message: `You have successfully booked a ticket for ${eventTitle}`,
        type: "ticket_booked",
        related_id: eventId
      });

      toast({
        title: "Ticket Booked!",
        description: "Your ticket has been confirmed",
      });
      
      setHasTicket(true);
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const viewTicket = () => {
    navigate('/tickets');
  };

  return (
    <div className="bg-accent/30 p-4 rounded-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Price</p>
            <p className="text-2xl font-bold">{price === 0 ? 'Free' : `₹${price}`}</p>
          </div>
          
          {capacity && (
            <div className="text-right">
              <p className="text-sm font-medium">Capacity</p>
              <p className="text-md">{currentAttendees} / {capacity}</p>
            </div>
          )}
        </div>
        
        {hasTicket ? (
          <Button onClick={viewTicket} className="w-full">
            <Ticket className="mr-2 h-4 w-4" />
            View My Ticket
          </Button>
        ) : (
          <Button 
            onClick={bookTicket} 
            disabled={isBooking || (capacity !== undefined && currentAttendees >= capacity)} 
            className="w-full"
          >
            {isBooking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : capacity !== undefined && currentAttendees >= capacity ? (
              'Sold Out'
            ) : (
              <>
                <Ticket className="mr-2 h-4 w-4" /> Book Ticket
              </>
            )}
          </Button>
        )}
        
        <p className="text-xs text-muted-foreground text-center">
          Secure transaction. You can view your tickets in your profile after purchase.
        </p>
      </div>
    </div>
  );
};

export default TicketBooking;
