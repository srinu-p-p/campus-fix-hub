import { IssueCategory, IssuePriority } from '@/types';

// Smart detection simulation (kept client-side)
export function detectCategory(description: string): { category: IssueCategory; priority: IssuePriority; department: string } {
  const desc = description.toLowerCase();
  if (desc.includes('fan') || desc.includes('light') || desc.includes('electric') || desc.includes('power') || desc.includes('switch')) {
    return { category: 'electrical', priority: 'medium', department: 'Maintenance' };
  }
  if (desc.includes('water') || desc.includes('leak') || desc.includes('tap') || desc.includes('pipe') || desc.includes('drain')) {
    return { category: 'plumbing', priority: 'high', department: 'Maintenance' };
  }
  if (desc.includes('wifi') || desc.includes('internet') || desc.includes('network') || desc.includes('computer') || desc.includes('printer')) {
    return { category: 'network', priority: 'high', department: 'IT' };
  }
  if (desc.includes('chair') || desc.includes('desk') || desc.includes('table') || desc.includes('door') || desc.includes('window')) {
    return { category: 'furniture', priority: 'low', department: 'Maintenance' };
  }
  if (desc.includes('clean') || desc.includes('dirty') || desc.includes('garbage') || desc.includes('trash') || desc.includes('smell')) {
    return { category: 'cleanliness', priority: 'medium', department: 'Housekeeping' };
  }
  if (desc.includes('cctv') || desc.includes('security') || desc.includes('theft') || desc.includes('gate') || desc.includes('lock')) {
    return { category: 'security', priority: 'critical', department: 'Security' };
  }
  return { category: 'other', priority: 'medium', department: 'General' };
}
