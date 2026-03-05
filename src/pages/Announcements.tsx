import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { fetchAnnouncements, createAnnouncement } from '@/lib/queries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Megaphone, Pin, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const priorityColors: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  normal: 'bg-info text-info-foreground',
  high: 'bg-warning text-warning-foreground',
  urgent: 'bg-destructive text-destructive-foreground',
};

const Announcements = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'normal',
    is_pinned: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await fetchAnnouncements();
      setAnnouncements(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAnnouncements(); }, []);

  const isAdmin = profile?.role === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.title || !form.content) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await createAnnouncement({ ...form, created_by: user.id });
      toast({ title: 'Announcement posted!' });
      setDialogOpen(false);
      setForm({ title: '', content: '', category: 'general', priority: 'normal', is_pinned: false });
      loadAnnouncements();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 min-h-screen page-bg-announcements -m-6 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Announcements</h1>
            <p className="text-muted-foreground">Stay updated with the latest college news and notices</p>
          </div>
          {isAdmin && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2"><PlusCircle className="h-4 w-4" /> Post Announcement</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-display">New Announcement</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input placeholder="Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                  <Textarea placeholder="Content *" rows={5} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
                  <div className="grid grid-cols-2 gap-4">
                    <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                      <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="examination">Examination</SelectItem>
                        <SelectItem value="placement">Placement</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="cultural">Cultural</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                      <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.is_pinned} onChange={e => setForm(f => ({ ...f, is_pinned: e.target.checked }))} className="rounded" />
                    Pin this announcement
                  </label>
                  <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Posting...' : 'Post Announcement'}</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {loading ? (
          <p className="text-muted-foreground text-center py-12">Loading...</p>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No announcements yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map(a => (
              <Card key={a.id} className={`shadow-card border-border ${a.is_pinned ? 'ring-2 ring-accent/30' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {a.is_pinned && (
                          <span className="flex items-center gap-1 text-xs text-accent font-medium"><Pin className="h-3 w-3" />Pinned</span>
                        )}
                        <Badge className={`text-xs ${priorityColors[a.priority] || ''}`}>{a.priority}</Badge>
                        <Badge variant="outline" className="text-xs capitalize">{a.category}</Badge>
                      </div>
                      <h3 className="font-display font-bold text-lg text-foreground">{a.title}</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{a.content}</p>
                      <p className="text-xs text-muted-foreground/60">
                        {format(new Date(a.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Announcements;
