import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { getIssueById, getCurrentUser, updateIssueStatus } from '@/lib/store';
import { Issue, IssueStatus } from '@/types';
import { StatusBadge, PriorityBadge, categoryLabels } from '@/components/IssueBadges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Calendar, User, CheckCircle2 } from 'lucide-react';

const statusOrder: IssueStatus[] = ['submitted', 'reviewed', 'in_progress', 'resolved', 'closed'];

const IssueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const user = getCurrentUser();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [newStatus, setNewStatus] = useState<IssueStatus>('reviewed');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (id) setIssue(getIssueById(id));
  }, [id]);

  if (!issue) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Issue not found</p>
          <Link to="/dashboard"><Button variant="outline" className="mt-4">Go Back</Button></Link>
        </div>
      </AppLayout>
    );
  }

  const isAdmin = user?.role === 'admin';
  const backLink = isAdmin ? '/admin/issues' : '/dashboard';

  const handleUpdate = () => {
    if (!note.trim()) {
      toast({ title: 'Note required', description: 'Please add a note explaining the update.', variant: 'destructive' });
      return;
    }
    const updated = updateIssueStatus(issue.id, newStatus, note, user?.name || 'Admin');
    if (updated) {
      setIssue(updated);
      setNote('');
      toast({ title: 'Status Updated', description: `Issue status changed to ${newStatus}` });
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to={backLink} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{issue.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {issue.location}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(issue.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {issue.reporterName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={issue.priority} />
            <StatusBadge status={issue.status} />
          </div>
        </div>

        <Card className="shadow-card border-border">
          <CardHeader><CardTitle className="text-base font-display">Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-foreground">{issue.description}</p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Category: {categoryLabels[issue.category]}</span>
              <span>Department: {issue.department}</span>
            </div>
            {issue.imageUrl && (
              <img src={issue.imageUrl} alt="Issue" className="rounded-lg max-h-64 object-cover border border-border" />
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="shadow-card border-border">
          <CardHeader><CardTitle className="text-base font-display">Progress Timeline</CardTitle></CardHeader>
          <CardContent>
            <div className="relative">
              {issue.timeline.map((entry, i) => (
                <div key={i} className="flex gap-4 pb-6 last:pb-0 animate-slide-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-secondary" />
                    </div>
                    {i < issue.timeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="flex-1 min-w-0 pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={entry.status} />
                      <span className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-foreground">{entry.note}</p>
                    <p className="text-xs text-muted-foreground mt-1">By: {entry.updatedBy}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Update */}
        {isAdmin && issue.status !== 'closed' && (
          <Card className="shadow-elevated border-secondary/20">
            <CardHeader><CardTitle className="text-base font-display">Update Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>New Status</Label>
                <Select value={newStatus} onValueChange={v => setNewStatus(v as IssueStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusOrder.filter(s => statusOrder.indexOf(s) > statusOrder.indexOf(issue.status)).map(s => (
                      <SelectItem key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Update Note (required)</Label>
                <Textarea placeholder="Describe what action was taken..." value={note} onChange={e => setNote(e.target.value)} />
              </div>
              <Button onClick={handleUpdate} className="gap-2">
                <CheckCircle2 className="h-4 w-4" /> Update Issue
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default IssueDetail;
