import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { getIssues } from '@/lib/store';
import { Issue, IssueStatus } from '@/types';
import { StatusBadge, PriorityBadge, categoryLabels } from '@/components/IssueBadges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const AdminIssues = () => {
  const allIssues = getIssues();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');

  const filtered = allIssues.filter(issue => {
    const matchSearch = issue.title.toLowerCase().includes(search.toLowerCase()) || issue.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchDept = deptFilter === 'all' || issue.department === deptFilter;
    return matchSearch && matchStatus && matchDept;
  });

  return (
    <AppLayout requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Manage Issues</h1>
          <p className="text-muted-foreground">Review and update reported campus issues</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search issues..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Housekeeping">Housekeeping</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Issue List */}
        <Card className="shadow-card border-border">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No issues match your filters</div>
              ) : (
                filtered.map(issue => (
                  <Link key={issue.id} to={`/issue/${issue.id}`} className="block">
                    <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm truncate">{issue.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>{categoryLabels[issue.category]}</span>
                          <span>•</span>
                          <span>{issue.department}</span>
                          <span>•</span>
                          <span>{issue.location}</span>
                          <span>•</span>
                          <span>{issue.reporterName}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4 shrink-0">
                        <PriorityBadge priority={issue.priority} />
                        <StatusBadge status={issue.status} />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminIssues;
