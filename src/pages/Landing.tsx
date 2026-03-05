import { Wrench, ArrowRight, AlertTriangle, Clock, CheckCircle, Users, Search, CalendarDays, Megaphone, MapPin, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import campusHero from '@/assets/campus-hero.jpg';

const features = [
  { icon: AlertTriangle, title: 'Report Issues', description: 'Submit campus issues with smart category detection and image upload.', color: 'hsl(var(--accent))' },
  { icon: Clock, title: 'Real-Time Tracking', description: 'Follow your issue through every stage from submission to resolution.', color: 'hsl(var(--info))' },
  { icon: CheckCircle, title: 'Quick Resolution', description: 'Issues are routed to the right department for fast action.', color: 'hsl(var(--success))' },
  { icon: Users, title: 'Transparent Process', description: 'See who is handling your issue and all progress updates.', color: 'hsl(var(--secondary))' },
];

const services = [
  {
    icon: Search,
    title: 'Lost & Found',
    description: 'Lost something on campus? Report it instantly or help reunite found items with their owners.',
    link: '/lost-found',
    gradient: 'from-amber-500/20 to-orange-500/20',
    iconBg: 'bg-accent/15',
    iconColor: 'text-accent',
  },
  {
    icon: CalendarDays,
    title: 'Campus Events',
    description: 'Discover and register for college events — fests, workshops, seminars, and more.',
    link: '/events',
    gradient: 'from-teal-500/20 to-emerald-500/20',
    iconBg: 'bg-secondary/15',
    iconColor: 'text-secondary',
  },
  {
    icon: Megaphone,
    title: 'Announcements',
    description: 'Stay updated with official college notices, exam schedules, and important updates.',
    link: '/announcements',
    gradient: 'from-blue-500/20 to-indigo-500/20',
    iconBg: 'bg-info/15',
    iconColor: 'text-info',
  },
  {
    icon: MapPin,
    title: 'Issue Reporting',
    description: 'Report broken infrastructure, maintenance issues, and safety concerns on campus.',
    link: '/report',
    gradient: 'from-rose-500/20 to-pink-500/20',
    iconBg: 'bg-destructive/15',
    iconColor: 'text-destructive',
  },
];

const Landing = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Wrench className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">Campus Fix</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
              aria-label="Toggle dark mode"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero with campus image */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${campusHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-background" />
        <div className="relative z-10 container mx-auto px-4 text-center py-20">
          <div className="max-w-3xl mx-auto animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm text-white mb-6">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              Your Complete Campus Companion
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
              Your Campus,<br />
              <span className="text-gradient-hero">Smarter & Connected</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Report issues, find lost items, discover events, and stay updated — all in one platform built for your campus life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base px-8 gap-2 shadow-glow">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services / New Features */}
      <section className="py-20 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-wider text-secondary">Everything You Need</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2 mb-3">One Platform, All Campus Services</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From reporting issues to discovering events — Campus Fix has you covered.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {services.map((s, i) => (
              <Link to={s.link} key={i} className="group">
                <div
                  className={`p-6 rounded-2xl bg-gradient-to-br ${s.gradient} border border-border/50 hover:border-secondary/30 transition-all duration-300 hover:shadow-elevated animate-fade-up h-full`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`h-12 w-12 rounded-xl ${s.iconBg} flex items-center justify-center mb-4`}>
                    <s.icon className={`h-6 w-6 ${s.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-2 group-hover:text-secondary transition-colors">{s.title}</h3>
                  <p className="text-muted-foreground">{s.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold uppercase tracking-wider text-secondary">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2 mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A simple, transparent process from report to resolution</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="h-11 w-11 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${f.color}15` }}>
                  <f.icon className="h-5 w-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-border/50 p-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Join your fellow students and make campus life better for everyone.</p>
            <Link to="/signup">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base px-8 gap-2">
                Create Your Account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 Campus Fix. Built for smarter campus management.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
