import AppLayout from '@/components/AppLayout';
import { getStats, getCategoryStats, getPriorityStats, getDepartmentStats } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(200, 80%, 50%)', 'hsl(38, 92%, 50%)', 'hsl(25, 95%, 55%)', 'hsl(0, 72%, 51%)'];
const CAT_COLORS = ['hsl(45, 90%, 50%)', 'hsl(200, 70%, 50%)', 'hsl(152, 60%, 42%)', 'hsl(280, 60%, 55%)', 'hsl(25, 95%, 55%)', 'hsl(0, 72%, 51%)', 'hsl(215, 50%, 50%)'];

const AdminAnalytics = () => {
  const stats = getStats();
  const categoryStats = getCategoryStats();
  const priorityStats = getPriorityStats();
  const deptStats = getDepartmentStats();

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <AppLayout requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Performance metrics and issue breakdown</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-display font-bold text-foreground">{resolutionRate}%</p>
              <p className="text-xs text-muted-foreground">Resolution Rate</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-display font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Issues</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-display font-bold text-secondary">~2.5d</p>
              <p className="text-xs text-muted-foreground">Avg Resolution Time</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-display font-bold text-destructive">{stats.critical}</p>
              <p className="text-xs text-muted-foreground">Critical Issues</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display text-base">Issues by Category</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryStats} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={({ category, count }) => `${category} (${count})`}>
                      {categoryStats.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Priority Breakdown */}
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display text-base">Issues by Priority</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                    <XAxis dataKey="priority" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {priorityStats.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Table */}
        <Card className="shadow-card">
          <CardHeader><CardTitle className="font-display text-base">Department Scoreboard</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Department</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">Total</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">Active</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">Resolved</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {deptStats.map(d => (
                    <tr key={d.department} className="border-b border-border last:border-0">
                      <td className="py-3 px-4 font-medium text-foreground">{d.department}</td>
                      <td className="py-3 px-4 text-center text-foreground">{d.total}</td>
                      <td className="py-3 px-4 text-center text-warning">{d.active}</td>
                      <td className="py-3 px-4 text-center text-success">{d.resolved}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-medium ${d.resolutionRate >= 50 ? 'text-success' : 'text-destructive'}`}>{d.resolutionRate}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminAnalytics;
