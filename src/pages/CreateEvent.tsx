
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import { Loader2, CalendarIcon, Clock, MapPin, Users, ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const categories = [
  "Concert", "Party", "Festival", "Conference", "Workshop", 
  "Exhibition", "Sports", "Theater", "Comedy", "Other"
];

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [capacity, setCapacity] = useState<number | ''>('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('22:00');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create an event.",
      });
      return;
    }
    
    if (!title || !description || !location || !startDate || !endDate || !startTime || !endTime || !category) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Combine date and time
      const startDateTime = new Date(startDate);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      startDateTime.setHours(startHours, startMinutes);
      
      const endDateTime = new Date(endDate);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      endDateTime.setHours(endHours, endMinutes);
      
      const eventData = {
        created_by: user.id,
        title,
        description,
        location,
        image_url: imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        capacity: capacity || null,
        category,
        price: price || 0,
        is_published: true,
      };
      
      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select('id')
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Event created successfully",
        description: "Your event has been published.",
      });
      
      // Navigate to the event detail page
      navigate(`/event/${data.id}`);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create event",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Event</CardTitle>
            <CardDescription>Fill in the details to create and publish your event</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-md">Event Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a catchy title for your event"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-md">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your event in detail"
                  className="min-h-[120px]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-md">Location *</Label>
                  <div className="relative">
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter venue location"
                      className="pl-9"
                      required
                    />
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-md">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-md">Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-md">Start Time *</Label>
                  <div className="relative">
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="pl-9"
                      required
                    />
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-md">End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-md">End Time *</Label>
                  <div className="relative">
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="pl-9"
                      required
                    />
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-md">Capacity (optional)</Label>
                  <div className="relative">
                    <Input
                      id="capacity"
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value ? parseInt(e.target.value) : '')}
                      placeholder="Max number of attendees"
                      className="pl-9"
                      min={1}
                    />
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-md">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : '')}
                    placeholder="0 for free events"
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-md">Event Image URL (optional)</Label>
                <div className="relative">
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL for your event"
                    className="pl-9"
                  />
                  <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Leave blank to use a default image</p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Event...
                  </>
                ) : (
                  'Create Event'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateEvent;
