export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
  createdAt: string;
}

export type IssueStatus = 'submitted' | 'reviewed' | 'in_progress' | 'resolved' | 'closed';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type IssueCategory = 'electrical' | 'plumbing' | 'furniture' | 'cleanliness' | 'network' | 'security' | 'other';

export interface TimelineEntry {
  status: IssueStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  location: string;
  department: string;
  reportedBy: string;
  reporterName: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
}
