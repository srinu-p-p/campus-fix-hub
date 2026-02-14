import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { getCurrentUser, createIssue, detectCategory } from '@/lib/store';
import { IssueCategory, IssuePriority } from '@/types';
import { categoryLabels } from '@/components/IssueBadges';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Sparkles, Send, ImagePlus } from 'lucide-react';

const ReportIssue = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<IssueCategory>('other');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [department, setDepartment] = useState('General');
  const [imageUrl, setImageUrl] = useState('');
  const [detected, setDetected] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    createIssue({
      title,
      description,
      category,
      priority,
      location,
      department,
      reportedBy: user.id,
      reporterName: user.name,
      imageUrl: imageUrl || undefined,
    });
    toast({ title: 'Issue Reported!', description: 'Your issue has been submitted successfully.' });
    navigate('/dashboard');
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
                <Input id="location" placeholder="e.g. Block A, Room 302" value={location} onChange={e => setLocation(e.target.value)} required />
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
                <Label htmlFor="image">Image URL (optional)</Label>
                <div className="flex gap-2">
                  <Input id="image" placeholder="https://..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                  <Button type="button" variant="outline" size="icon"><ImagePlus className="h-4 w-4" /></Button>
                </div>
              </div>

              <Button type="submit" className="w-full gap-2">
                <Send className="h-4 w-4" /> Submit Report
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ReportIssue;
