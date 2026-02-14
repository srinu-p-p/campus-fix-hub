import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/lib/store';
import { Wrench, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = login(email, password);
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Wrench className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold text-foreground">Campus Fix</span>
          </Link>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <Card className="shadow-elevated border-border">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-display">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@campus.edu" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="text-secondary font-medium hover:underline">Sign up</Link>
            </p>
            <div className="mt-4 p-3 rounded-md bg-muted text-xs text-muted-foreground">
              <p className="font-medium mb-1">Demo accounts:</p>
              <p>Student: sign up as new user</p>
              <p>Admin: admin@campus.edu / admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
