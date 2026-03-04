import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { createEvent } from '@/lib/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const eventCategories = ['General', 'Academic', 'Sports', 'Cultural', 'Technical', 'Social'];

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    event_date: '',
    end_date: '',
    location: '',
    category: 'general',
    max_participants: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.title || !form.description || !form.event_date || !form.location) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await createEvent({
        title: form.title,
        description: form.description,
        event_date: new Date(form.event_date).toISOString(),
        end_date: form.end_date ? new Date(form.end_date).toISOString() : undefined,
        location: form.location,
        category: form.category,
        max_participants: form.max_participants ? parseInt(form.max_participants) : undefined,
        created_by: user.id,
      });
      toast({ title: 'Event created successfully!' });
      navigate('/events');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout requireAdmin>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">Create Event</h1>
        <Card className="shadow-card border-border">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Event title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              <Textarea placeholder="Description *" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  {eventCategories.map(c => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input placeholder="Location *" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Start Date & Time *</label>
                  <Input type="datetime-local" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">End Date & Time</label>
                  <Input type="datetime-local" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
                </div>
              </div>
              <Input type="number" placeholder="Max participants (optional)" value={form.max_participants} onChange={e => setForm(f => ({ ...f, max_participants: e.target.value }))} />
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/events')}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={submitting}>{submitting ? 'Creating...' : 'Create Event'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreateEvent;
