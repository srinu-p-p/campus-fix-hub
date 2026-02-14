import { Wrench, ArrowRight, AlertTriangle, Clock, CheckCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const features = [
  { icon: AlertTriangle, title: 'Report Issues', description: 'Submit campus issues with smart category detection and image upload.' },
  { icon: Clock, title: 'Real-Time Tracking', description: 'Follow your issue through every stage from submission to resolution.' },
  { icon: CheckCircle, title: 'Quick Resolution', description: 'Issues are routed to the right department for fast action.' },
  { icon: Users, title: 'Transparent Process', description: 'See who is handling your issue and all progress updates.' },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Wrench className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">Campus Fix</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-hero-pattern py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-sidebar-border bg-sidebar-accent/50 px-4 py-1.5 text-sm text-sidebar-foreground mb-6">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              Campus Infrastructure Management
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight">
              Fix Your Campus,<br />
              <span className="text-gradient-hero">One Report at a Time</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
              Report broken infrastructure, track repairs in real-time, and help make your campus a better place for everyone.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base px-8 gap-2">
                  Report an Issue <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A simple, transparent process from report to resolution</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="h-11 w-11 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
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
