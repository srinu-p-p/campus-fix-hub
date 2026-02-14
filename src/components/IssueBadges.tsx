import { IssueStatus, IssuePriority, IssueCategory } from '@/types';
import { cn } from '@/lib/utils';

export const statusConfig: Record<IssueStatus, { label: string; className: string }> = {
  submitted: { label: 'Submitted', className: 'bg-info/10 text-info border-info/20' },
  reviewed: { label: 'Reviewed', className: 'bg-warning/10 text-warning border-warning/20' },
  in_progress: { label: 'In Progress', className: 'bg-accent/10 text-accent border-accent/20' },
  resolved: { label: 'Resolved', className: 'bg-success/10 text-success border-success/20' },
  closed: { label: 'Closed', className: 'bg-muted text-muted-foreground border-border' },
};

export const priorityConfig: Record<IssuePriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', className: 'bg-info/10 text-info' },
  high: { label: 'High', className: 'bg-warning/10 text-warning' },
  critical: { label: 'Critical', className: 'bg-destructive/10 text-destructive' },
};

export const categoryLabels: Record<IssueCategory, string> = {
  electrical: '⚡ Electrical',
  plumbing: '🔧 Plumbing',
  furniture: '🪑 Furniture',
  cleanliness: '🧹 Cleanliness',
  network: '📡 Network',
  security: '🔒 Security',
  other: '📋 Other',
};

export const StatusBadge = ({ status }: { status: IssueStatus }) => {
  const config = statusConfig[status];
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', config.className)}>
      {config.label}
    </span>
  );
};

export const PriorityBadge = ({ priority }: { priority: IssuePriority }) => {
  const config = priorityConfig[priority];
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', config.className)}>
      {config.label}
    </span>
  );
};
