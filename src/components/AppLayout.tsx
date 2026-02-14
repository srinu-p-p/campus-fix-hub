import { ReactNode, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { getCurrentUser, logout } from '@/lib/store';
import { Wrench, LayoutDashboard, PlusCircle, LogOut, Shield, BarChart3, Building2, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const AppLayout = ({ children, requireAuth = true, requireAdmin = false }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  useEffect(() => {
    if (requireAuth && !user) {
      navigate('/login');
    }
    if (requireAdmin && user?.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, requireAuth, requireAdmin, navigate]);

  if (requireAuth && !user) return null;

  const isAdmin = user?.role === 'admin';

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/report', label: 'Report Issue', icon: PlusCircle },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/issues', label: 'Manage Issues', icon: ClipboardList },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/departments', label: 'Departments', icon: Building2 },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Wrench className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <span className="text-lg font-display font-bold text-sidebar-foreground">Campus Fix</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {isAdmin && (
            <div className="flex items-center gap-2 px-3 py-2 mb-2">
              <Shield className="h-3.5 w-3.5 text-sidebar-primary" />
              <span className="text-xs font-medium text-sidebar-primary uppercase tracking-wider">Admin Panel</span>
            </div>
          )}
          {links.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
