import { User, Issue, IssueStatus, IssueCategory, IssuePriority } from '@/types';

const USERS_KEY = 'campusfix_users';
const ISSUES_KEY = 'campusfix_issues';
const AUTH_KEY = 'campusfix_auth';

// Seed admin accounts
const SEED_ADMINS: User[] = [
  { id: 'admin-1', name: 'Admin User', email: 'admin@campus.edu', password: 'admin123', role: 'admin', department: 'General', createdAt: new Date().toISOString() },
  { id: 'admin-2', name: 'Maintenance Head', email: 'maintenance@campus.edu', password: 'admin123', role: 'admin', department: 'Maintenance', createdAt: new Date().toISOString() },
  { id: 'admin-3', name: 'IT Support', email: 'it@campus.edu', password: 'admin123', role: 'admin', department: 'IT', createdAt: new Date().toISOString() },
  { id: 'admin-4', name: 'Housekeeping Lead', email: 'housekeeping@campus.edu', password: 'admin123', role: 'admin', department: 'Housekeeping', createdAt: new Date().toISOString() },
  { id: 'admin-5', name: 'Security Chief', email: 'security@campus.edu', password: 'admin123', role: 'admin', department: 'Security', createdAt: new Date().toISOString() },
];

const SEED_ISSUES: Issue[] = [
  {
    id: 'issue-1', title: 'Broken ceiling fan in Room 302', description: 'The ceiling fan in Room 302 has stopped working completely. It makes a grinding noise when switched on.', category: 'electrical', priority: 'medium', status: 'in_progress', location: 'Block A, Room 302', department: 'Maintenance', reportedBy: 'student-1', reporterName: 'Demo Student', createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString(),
    timeline: [
      { status: 'submitted', timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), note: 'Issue reported by student', updatedBy: 'Demo Student' },
      { status: 'reviewed', timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), note: 'Reviewed and assigned to maintenance team', updatedBy: 'Admin User' },
      { status: 'in_progress', timestamp: new Date(Date.now() - 86400000).toISOString(), note: 'Technician dispatched to inspect the fan', updatedBy: 'Maintenance Head' },
    ],
  },
  {
    id: 'issue-2', title: 'Water leakage in washroom', description: 'Continuous water leakage from the tap in the 2nd floor washroom.', category: 'plumbing', priority: 'high', status: 'submitted', location: 'Block B, 2nd Floor Washroom', department: 'Maintenance', reportedBy: 'student-1', reporterName: 'Demo Student', createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString(),
    timeline: [
      { status: 'submitted', timestamp: new Date(Date.now() - 86400000).toISOString(), note: 'Issue reported by student', updatedBy: 'Demo Student' },
    ],
  },
  {
    id: 'issue-3', title: 'WiFi not working in Library', description: 'The WiFi network is down in the library area. Students cannot access online resources.', category: 'network', priority: 'critical', status: 'resolved', location: 'Central Library', department: 'IT', reportedBy: 'student-2', reporterName: 'Jane Doe', createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    timeline: [
      { status: 'submitted', timestamp: new Date(Date.now() - 5 * 86400000).toISOString(), note: 'Issue reported', updatedBy: 'Jane Doe' },
      { status: 'reviewed', timestamp: new Date(Date.now() - 4 * 86400000).toISOString(), note: 'IT team notified', updatedBy: 'Admin User' },
      { status: 'in_progress', timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), note: 'Router replacement in progress', updatedBy: 'IT Support' },
      { status: 'resolved', timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), note: 'New router installed and tested', updatedBy: 'IT Support' },
    ],
  },
  {
    id: 'issue-4', title: 'Broken chair in Lecture Hall', description: 'Multiple chairs broken in Lecture Hall 5.', category: 'furniture', priority: 'low', status: 'reviewed', location: 'Lecture Hall 5', department: 'Maintenance', reportedBy: 'student-2', reporterName: 'Jane Doe', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    timeline: [
      { status: 'submitted', timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), note: 'Issue reported', updatedBy: 'Jane Doe' },
      { status: 'reviewed', timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), note: 'Will be fixed during weekend maintenance', updatedBy: 'Admin User' },
    ],
  },
  {
    id: 'issue-5', title: 'CCTV camera offline', description: 'The CCTV camera near the main gate is not recording.', category: 'security', priority: 'critical', status: 'in_progress', location: 'Main Gate', department: 'Security', reportedBy: 'student-1', reporterName: 'Demo Student', createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    timeline: [
      { status: 'submitted', timestamp: new Date(Date.now() - 4 * 86400000).toISOString(), note: 'Issue reported', updatedBy: 'Demo Student' },
      { status: 'reviewed', timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), note: 'Security team alerted', updatedBy: 'Admin User' },
      { status: 'in_progress', timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), note: 'Replacement camera ordered', updatedBy: 'Security Chief' },
    ],
  },
];

function initStore() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(SEED_ADMINS));
  } else {
    // Ensure admins exist
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY)!);
    for (const admin of SEED_ADMINS) {
      if (!users.find(u => u.email === admin.email)) {
        users.push(admin);
      }
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  if (!localStorage.getItem(ISSUES_KEY)) {
    localStorage.setItem(ISSUES_KEY, JSON.stringify(SEED_ISSUES));
  }
}

initStore();

// Auth
export function login(email: string, password: string): User | null {
  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }
  return null;
}

export function signup(name: string, email: string, password: string): { success: boolean; error?: string } {
  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Email already registered' };
  }
  const newUser: User = {
    id: `student-${Date.now()}`,
    name,
    email,
    password,
    role: 'student',
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true };
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
}

// Issues
export function getIssues(): Issue[] {
  return JSON.parse(localStorage.getItem(ISSUES_KEY) || '[]');
}

export function getIssueById(id: string): Issue | null {
  return getIssues().find(i => i.id === id) || null;
}

export function getUserIssues(userId: string): Issue[] {
  return getIssues().filter(i => i.reportedBy === userId);
}

export function createIssue(issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'status'>): Issue {
  const issues = getIssues();
  const newIssue: Issue = {
    ...issue,
    id: `issue-${Date.now()}`,
    status: 'submitted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      { status: 'submitted', timestamp: new Date().toISOString(), note: 'Issue reported by ' + issue.reporterName, updatedBy: issue.reporterName },
    ],
  };
  issues.unshift(newIssue);
  localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
  return newIssue;
}

export function updateIssueStatus(issueId: string, newStatus: IssueStatus, note: string, updatedBy: string): Issue | null {
  const issues = getIssues();
  const idx = issues.findIndex(i => i.id === issueId);
  if (idx === -1) return null;
  issues[idx].status = newStatus;
  issues[idx].updatedAt = new Date().toISOString();
  issues[idx].timeline.push({
    status: newStatus,
    timestamp: new Date().toISOString(),
    note,
    updatedBy,
  });
  localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
  return issues[idx];
}

// Stats
export function getStats() {
  const issues = getIssues();
  return {
    total: issues.length,
    submitted: issues.filter(i => i.status === 'submitted').length,
    inProgress: issues.filter(i => i.status === 'in_progress' || i.status === 'reviewed').length,
    resolved: issues.filter(i => i.status === 'resolved' || i.status === 'closed').length,
    critical: issues.filter(i => i.priority === 'critical').length,
  };
}

export function getDepartmentStats() {
  const issues = getIssues();
  const departments = ['Maintenance', 'IT', 'Housekeeping', 'Security', 'General'];
  return departments.map(dept => {
    const deptIssues = issues.filter(i => i.department === dept);
    const resolved = deptIssues.filter(i => i.status === 'resolved' || i.status === 'closed').length;
    return {
      department: dept,
      total: deptIssues.length,
      active: deptIssues.filter(i => i.status !== 'resolved' && i.status !== 'closed').length,
      resolved,
      resolutionRate: deptIssues.length > 0 ? Math.round((resolved / deptIssues.length) * 100) : 0,
    };
  });
}

export function getCategoryStats() {
  const issues = getIssues();
  const categories: IssueCategory[] = ['electrical', 'plumbing', 'furniture', 'cleanliness', 'network', 'security', 'other'];
  return categories.map(cat => ({
    category: cat,
    count: issues.filter(i => i.category === cat).length,
  })).filter(c => c.count > 0);
}

export function getPriorityStats() {
  const issues = getIssues();
  const priorities: IssuePriority[] = ['low', 'medium', 'high', 'critical'];
  return priorities.map(p => ({
    priority: p,
    count: issues.filter(i => i.priority === p).length,
  }));
}

// Smart detection simulation
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
