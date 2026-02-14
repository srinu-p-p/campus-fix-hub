import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { getCurrentUser, getUserIssues, getStats } from '@/lib/store';
import { Issue } from '@/types';
import { StatusBadge, PriorityBadge, categoryLabels } from '@/components/IssueBadges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle, Clock, CheckCircle, FileText } from 'lucide-react';

const Dashboard = () => {
  const user = getCurrentUser();
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    if (user) {
      setIssues(getUserIssues(user.id));
    }
  }, [user]);

  const myStats = {
    total: issues.length,
    active: issues.filter(i => i.status !== 'resolved' && i.status !== 'closed').length,
    resolved: issues.filter(i => i.status === 'resolved' || i.status === 'closed').length,
    critical: issues.filter(i => i.priority === 'critical').length,
  };

  const statCards = [
    { label: 'Total Reports', value: myStats.total, icon: FileText, accent: 'text-info' },
    { label: 'Active Issues', value: myStats.active, icon: Clock, accent: 'text-warning' },
    { label: 'Resolved', value: myStats.resolved, icon: CheckCircle, accent: 'text-success' },
    { label: 'Critical', value: myStats.critical, icon: AlertTriangle, accent: 'text-destructive' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground">Track your reported issues and submit new ones</p>
          </div>
          <Link to="/report">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" /> Report Issue
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <Card key={i} className="shadow-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${s.accent}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground animate-count-up">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Issue List */}
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Your Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {issues.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No issues reported yet</p>
                <Link to="/report">
                  <Button variant="outline" className="mt-4 gap-2">
                    <PlusCircle className="h-4 w-4" /> Report Your First Issue
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {issues.map(issue => (
                  <Link key={issue.id} to={`/issue/${issue.id}`} className="block">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground truncate">{issue.title}</h3>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{categoryLabels[issue.category]}</span>
                          <span>•</span>
                          <span>{issue.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <PriorityBadge priority={issue.priority} />
                        <StatusBadge status={issue.status} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
