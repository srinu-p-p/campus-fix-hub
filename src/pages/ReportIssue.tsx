import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { createIssue } from '@/lib/queries';
import { detectCategory } from '@/lib/store';
import { IssueCategory, IssuePriority } from '@/types';
import { categoryLabels } from '@/components/IssueBadges';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Sparkles, Send, ImagePlus, Camera, X, MapPin, Loader2 } from 'lucide-react';

const ReportIssue = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<IssueCategory>('other');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [department, setDepartment] = useState('General');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detected, setDetected] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please upload an image under 5MB', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: 'Not supported', description: 'Geolocation is not supported by your browser', variant: 'destructive' });
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          setLocation(data.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        } catch {
          setLocation(`Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`);
        }
        setDetectingLocation(false);
        toast({ title: 'Location detected!' });
      },
      (err) => {
        setDetectingLocation(false);
        toast({ title: 'Location error', description: err.message, variant: 'destructive' });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (value.length > 20 && !detected) {
      const result = detectCategory(value);
      setCategory(result.category);
      setPriority(result.priority);
      setDepartment(result.department);
      setDetected(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setSubmitting(true);
    try {
      await createIssue({
        title,
        description,
        category,
        priority,
        location,
        department,
        reported_by: user.id,
        reporter_name: profile.name,
        image_url: imagePreview || undefined,
      });
      toast({ title: 'Issue Reported!', description: 'Your issue has been submitted successfully.' });
      navigate('/dashboard');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setSubmitting(false);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-foreground mb-1">Report an Issue</h1>
        <p className="text-muted-foreground mb-6">Describe the problem and we'll route it to the right team</p>

        <Card className="shadow-elevated border-border">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title</Label>
                <Input id="title" placeholder="e.g. Broken ceiling fan in Room 302" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the issue in detail..." value={description} onChange={e => handleDescriptionChange(e.target.value)} rows={4} required />
                {detected && (
                  <div className="flex items-center gap-2 text-xs text-secondary bg-secondary/10 px-3 py-2 rounded-md animate-fade-in">
                    <Sparkles className="h-3.5 w-3.5" />
                    Smart detection: {categoryLabels[category]} • {priority} priority • {department} dept
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex gap-2">
                  <Input id="location" placeholder="e.g. Block A, Room 302" value={location} onChange={e => setLocation(e.target.value)} required className="flex-1" />
                  <Button type="button" variant="outline" size="icon" onClick={handleDetectLocation} disabled={detectingLocation}>
                    {detectingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={v => setCategory(v as IssueCategory)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(categoryLabels) as IssueCategory[]).map(c => (
                        <SelectItem key={c} value={c}>{categoryLabels[c]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={v => setPriority(v as IssuePriority)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Attach Photo</Label>
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} className="hidden" onChange={handleImageUpload} />
                {imagePreview ? (
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img src={imagePreview} alt="Issue preview" className="w-full max-h-48 object-cover" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => setImagePreview(null)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" className="flex-1 gap-2" onClick={() => fileInputRef.current?.click()}>
                      <ImagePlus className="h-4 w-4" /> Upload Photo
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 gap-2" onClick={() => cameraInputRef.current?.click()}>
                      <Camera className="h-4 w-4" /> Take Photo
                    </Button>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full gap-2" disabled={submitting}>
                <Send className="h-4 w-4" /> {submitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ReportIssue;
