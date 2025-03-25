
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { format, formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  type: string;
  related_id: string | null;
  created_at: string;
}

const NotificationCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    // Fetch notifications
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }
      
      setNotifications(data || []);
    };
    
    fetchNotifications();
    
    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev.slice(0, 9)]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  const markAsRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
      
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
  };
  
  const markAllAsRead = async () => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user?.id)
      .in('id', notifications.filter(n => !n.is_read).map(n => n.id));
      
    setNotifications(prev => 
      prev.map(n => ({ ...n, is_read: true }))
    );
  };
  
  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'ticket_booked':
        return '🎟️';
      case 'event_reminder':
        return '⏰';
      case 'event_update':
        return '📝';
      case 'message':
        return '💬';
      default:
        return '📣';
    }
  };
  
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  if (!user) return null;
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 flex items-center justify-between">
          <h3 className="text-sm font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card key={notification.id} className={`rounded-none border-x-0 border-t-0 ${!notification.is_read ? 'bg-muted/50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="text-2xl">
                      {getNotificationTypeIcon(notification.type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{notification.title}</p>
                        {!notification.is_read && (
                          <Badge variant="secondary" className="ml-2 h-auto py-0 px-1">New</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardContent>
                {!notification.is_read && (
                  <CardFooter className="p-2 pt-0 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 text-xs text-primary"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
