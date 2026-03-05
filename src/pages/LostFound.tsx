import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { fetchLostFoundItems, createLostFoundItem, updateLostFoundStatus } from '@/lib/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Search, MapPin, Calendar, Package, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

const categories = ['Electronics', 'Books', 'Clothing', 'Accessories', 'ID/Cards', 'Keys', 'Other'];

const LostFound = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    type: 'lost' as 'lost' | 'found',
    title: '',
    description: '',
    category: '',
    location: '',
    date_occurred: new Date().toISOString().split('T')[0],
    contact_info: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchLostFoundItems(filter === 'all' ? undefined : filter);
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, [filter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.title || !form.description || !form.category || !form.location) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      let image_url: string | undefined;
      if (imageFile) {
        const path = `${user.id}/${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from('lost-found-images').upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('lost-found-images').getPublicUrl(path);
        image_url = urlData.publicUrl;
      }
      await createLostFoundItem({ ...form, user_id: user.id, image_url });
      toast({ title: `${form.type === 'lost' ? 'Lost' : 'Found'} item reported successfully!` });
      setDialogOpen(false);
      setForm({ type: 'lost', title: '', description: '', category: '', location: '', date_occurred: new Date().toISOString().split('T')[0], contact_info: '' });
      setImageFile(null);
      loadItems();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.description.toLowerCase().includes(search.toLowerCase()) ||
    i.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6 min-h-screen page-bg-lost-found -m-6 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Lost & Found</h1>
            <p className="text-muted-foreground">Report lost items or things you've found on campus</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><PlusCircle className="h-4 w-4" /> Report Item</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">Report Lost or Found Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Button type="button" variant={form.type === 'lost' ? 'default' : 'outline'} className="flex-1" onClick={() => setForm(f => ({ ...f, type: 'lost' }))}>I Lost Something</Button>
                  <Button type="button" variant={form.type === 'found' ? 'default' : 'outline'} className="flex-1" onClick={() => setForm(f => ({ ...f, type: 'found' }))}>I Found Something</Button>
                </div>
                <Input placeholder="Item name *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                <Textarea placeholder="Description *" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue placeholder="Category *" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input placeholder="Location (where lost/found) *" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
                <Input type="date" value={form.date_occurred} onChange={e => setForm(f => ({ ...f, date_occurred: e.target.value }))} />
                <Input placeholder="Contact info (phone/email)" value={form.contact_info} onChange={e => setForm(f => ({ ...f, contact_info: e.target.value }))} />
                <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Report'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search items..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Tabs value={filter} onValueChange={v => setFilter(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="lost">Lost</TabsTrigger>
              <TabsTrigger value="found">Found</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-center py-12">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No items found</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(item => (
              <Card key={item.id} className="shadow-card border-border overflow-hidden">
                {item.image_url && (
                  <div className="h-40 overflow-hidden">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={item.type === 'lost' ? 'destructive' : 'default'} className="text-xs">
                      {item.type === 'lost' ? 'Lost' : 'Found'}
                    </Badge>
                    <Badge variant={item.status === 'open' ? 'outline' : 'secondary'} className="text-xs capitalize">
                      {item.status}
                    </Badge>
                  </div>
                  <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{format(new Date(item.date_occurred), 'MMM d, yyyy')}</span>
                  </div>
                  {item.contact_info && (
                    <p className="text-xs text-muted-foreground">Contact: {item.contact_info}</p>
                  )}
                  {user && item.user_id === user.id && item.status === 'open' && (
                    <Button
                      variant="outline" size="sm" className="w-full mt-2"
                      onClick={async () => {
                        await updateLostFoundStatus(item.id, 'claimed');
                        loadItems();
                        toast({ title: 'Item marked as claimed!' });
                      }}
                    >
                      Mark as Claimed
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default LostFound;
