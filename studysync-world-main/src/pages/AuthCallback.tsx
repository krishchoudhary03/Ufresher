import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setLoading(true);
        
        // Get the session from URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          setTimeout(() => navigate('/auth'), 2000);
          return;
        }

        if (data.session?.user) {
          // Redirect to dashboard - the auth context will handle user loading
          navigate('/dashboard');
        } else {
          // No session, redirect to auth
          navigate('/auth');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
        setTimeout(() => navigate('/auth'), 2000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Completing Sign In</h2>
            <p className="text-muted-foreground">Please wait while we set up your account...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2 text-destructive">Sign In Failed</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-sm text-muted-foreground">Redirecting to sign in page...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
