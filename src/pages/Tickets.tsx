
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, MapPin, Clock, Ticket, QrCode } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  image_url: string;
  category: string;
}

interface Ticket {
  id: string;
  event_id: string;
  qr_code: string;
  price_paid: number;
  is_used: boolean;
  created_at: string;
  event: Event;
}

const TicketCard: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const [showQR, setShowQR] = useState(false);
  
  const startDate = parseISO(ticket.event.start_time);
  const endDate = parseISO(ticket.event.end_time);
  
  return (
    <Card className="glass-card overflow-hidden h-full">
      <div 
        className="h-32 bg-cover bg-center"
        style={{ backgroundImage: `url(${ticket.event.image_url})` }}
      >
        <div className="w-full h-full bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-4 text-white">
            <span className="bg-primary/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
              {ticket.event.category}
            </span>
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <Link to={`/event/${ticket.event.id}`}>
          <CardTitle className="text-lg hover:text-primary transition-colors">
            {ticket.event.title}
          </CardTitle>
        </Link>
        <CardDescription className="line-clamp-2">
          {ticket.event.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <CalendarIcon size={14} className="mr-2" />
            <span>{format(startDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-2" />
            <span>{format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}</span>
          </div>
          <div className="flex items-center">
            <MapPin size={14} className="mr-2" />
            <span className="line-clamp-1">{ticket.event.location}</span>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="flex justify-between items-center pt-2">
          <div>
            <div className="text-xs">Price Paid</div>
            <div className="font-bold">{ticket.price_paid > 0 ? `₹${ticket.price_paid}` : 'Free'}</div>
          </div>
          
          <Button 
            variant={showQR ? "outline" : "default"} 
            size="sm" 
            onClick={() => setShowQR(!showQR)}
          >
            {showQR ? 'Hide QR' : 'Show QR'} <QrCode className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {showQR && (
          <div className="border rounded-lg p-4 mt-4 flex flex-col items-center">
            <QRCode 
              value={ticket.qr_code} 
              size={150} 
              renderAs="svg" 
              includeMargin={true}
            />
            <div className="text-xs text-center mt-2 text-muted-foreground">
              Present this QR code at the event
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Tickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select(`
            *,
            event:event_id (
              id, title, description, location, start_time, end_time, image_url, category
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setTickets(data || []);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, [user]);
  
  const upcomingTickets = tickets.filter(ticket => new Date(ticket.event.start_time) > new Date());
  const pastTickets = tickets.filter(ticket => new Date(ticket.event.start_time) <= new Date());
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Tickets</h1>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              Upcoming <span className="ml-1 text-xs bg-primary/20 px-2 py-0.5 rounded-full">{upcomingTickets.length}</span>
            </TabsTrigger>
            <TabsTrigger value="past">
              Past <span className="ml-1 text-xs bg-muted px-2 py-0.5 rounded-full">{pastTickets.length}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading tickets...</p>
              </div>
            ) : upcomingTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No upcoming tickets</h3>
                <p className="text-muted-foreground mb-6">You don't have any tickets for upcoming events.</p>
                <Link to="/">
                  <Button>Browse Events</Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading tickets...</p>
              </div>
            ) : pastTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastTickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No past tickets</h3>
                <p className="text-muted-foreground">You haven't attended any events yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Tickets;
