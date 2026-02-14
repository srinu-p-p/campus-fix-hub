import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { getStats, getIssues, getDepartmentStats } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const AdminOverview = () => {
  const stats = getStats();
  const deptStats = getDepartmentStats();
  const issues = getIssues();
  const recentIssues = issues.slice(0, 5);

  const statCards = [
    { label: 'Total Issues', value: stats.total, icon: FileText, accent: 'text-info' },
    { label: 'Active', value: stats.inProgress + stats.submitted, icon: Clock, accent: 'text-warning' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, accent: 'text-success' },
    { label: 'Critical', value: stats.critical, icon: AlertTriangle, accent: 'text-destructive' },
  ];

  return (
    <AppLayout requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of campus infrastructure issues</p>
        </div>

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

        {/* Department Performance */}
        <Card className="shadow-card border-border">
          <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-secondary" /> Department Performance</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deptStats.map(dept => (
                <div key={dept.department} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{dept.department}</span>
                    <span className="text-muted-foreground">{dept.resolved}/{dept.total} resolved ({dept.resolutionRate}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${dept.resolutionRate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Issues */}
        <Card className="shadow-card border-border">
          <CardHeader><CardTitle className="font-display text-lg">Recent Issues</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentIssues.map(issue => (
                <a key={issue.id} href={`/issue/${issue.id}`} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-foreground text-sm">{issue.title}</p>
                    <p className="text-xs text-muted-foreground">{issue.department} • {issue.location}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${issue.priority === 'critical' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                    {issue.priority}
                  </span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminOverview;
