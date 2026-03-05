import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { fetchEvents, registerForEvent, unregisterFromEvent } from '@/lib/queries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

const statusColors: Record<string, string> = {
  upcoming: 'bg-info text-info-foreground',
  ongoing: 'bg-success text-success-foreground',
  completed: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive text-destructive-foreground',
};

const Events = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const evts = await fetchEvents();
      setEvents(evts);
      // Fetch registration counts
      if (evts.length > 0) {
        const { data: regs } = await supabase
          .from('event_registrations')
          .select('*')
          .in('event_id', evts.map((e: any) => e.id));
        const grouped: Record<string, any[]> = {};
        (regs || []).forEach((r: any) => {
          if (!grouped[r.event_id]) grouped[r.event_id] = [];
          grouped[r.event_id].push(r);
        });
        setRegistrations(grouped);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const isRegistered = (eventId: string) =>
    registrations[eventId]?.some(r => r.user_id === user?.id) ?? false;

  const handleRegister = async (eventId: string) => {
    if (!user) return;
    try {
      await registerForEvent(eventId, user.id);
      toast({ title: 'Registered successfully!' });
      loadEvents();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (!user) return;
    try {
      await unregisterFromEvent(eventId, user.id);
      toast({ title: 'Unregistered from event' });
      loadEvents();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AppLayout>
      <div className="space-y-6 min-h-screen page-bg-events -m-6 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Campus Events</h1>
            <p className="text-muted-foreground">Discover and register for upcoming campus events</p>
          </div>
          {isAdmin && (
            <Link to="/admin/events/create">
              <Button className="gap-2"><CalendarDays className="h-4 w-4" /> Create Event</Button>
            </Link>
          )}
        </div>

        {loading ? (
          <p className="text-muted-foreground text-center py-12">Loading events...</p>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDays className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No events scheduled</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map(event => {
              const regCount = registrations[event.id]?.length || 0;
              const registered = isRegistered(event.id);
              const isFull = event.max_participants && regCount >= event.max_participants;
              return (
                <Card key={event.id} className="shadow-card border-border overflow-hidden hover:shadow-elevated transition-shadow">
                  {event.image_url && (
                    <div className="h-40 overflow-hidden">
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${statusColors[event.status] || ''}`}>{event.status}</Badge>
                      <Badge variant="outline" className="text-xs capitalize">{event.category}</Badge>
                    </div>
                    <h3 className="font-display font-bold text-lg text-foreground">{event.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {format(new Date(event.event_date), 'MMM d, yyyy h:mm a')}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {regCount} registered {event.max_participants ? `/ ${event.max_participants} max` : ''}
                      </div>
                    </div>
                    {event.status === 'upcoming' && (
                      registered ? (
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleUnregister(event.id)}>
                          Unregister
                        </Button>
                      ) : (
                        <Button size="sm" className="w-full" disabled={!!isFull} onClick={() => handleRegister(event.id)}>
                          {isFull ? 'Event Full' : 'Register'}
                        </Button>
                      )
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Events;
