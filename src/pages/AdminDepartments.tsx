import AppLayout from '@/components/AppLayout';
import { getDepartmentStats } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, TrendingUp, Users } from 'lucide-react';

const adminAssignments: Record<string, string> = {
  Maintenance: 'maintenance@campus.edu',
  IT: 'it@campus.edu',
  Housekeeping: 'housekeeping@campus.edu',
  Security: 'security@campus.edu',
  General: 'admin@campus.edu',
};

const AdminDepartments = () => {
  const deptStats = getDepartmentStats();

  return (
    <AppLayout requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Departments</h1>
          <p className="text-muted-foreground">Department performance and assignments</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deptStats.map(dept => (
            <Card key={dept.department} className="shadow-card border-border hover:shadow-elevated transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-secondary" />
                  </div>
                  <CardTitle className="font-display text-base">{dept.department}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-muted">
                    <p className="text-lg font-bold text-foreground">{dept.total}</p>
                    <p className="text-[10px] text-muted-foreground">Total</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted">
                    <p className="text-lg font-bold text-warning">{dept.active}</p>
                    <p className="text-[10px] text-muted-foreground">Active</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted">
                    <p className="text-lg font-bold text-success">{dept.resolved}</p>
                    <p className="text-[10px] text-muted-foreground">Resolved</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Resolution Rate</span>
                    <span className={`font-medium ${dept.resolutionRate >= 50 ? 'text-success' : 'text-destructive'}`}>{dept.resolutionRate}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${dept.resolutionRate}%` }} />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border">
                  <Users className="h-3 w-3" />
                  <span>{adminAssignments[dept.department]}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDepartments;
