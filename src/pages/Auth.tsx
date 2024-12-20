import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's already a session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast.success('Successfully signed in!');
        navigate('/dashboard');
      }
      if (event === 'SIGNED_OUT') {
        // Clear any local storage or state if needed
        try {
          await supabase.auth.signOut();
        } catch (error: any) {
          // If we get a 403 session_not_found, we can safely ignore it
          // as the user is already signed out
          if (error?.error_type === 'http_client_error' && 
              error?.body?.includes('session_not_found')) {
            console.log('Session already cleared');
          } else {
            console.error('Logout error:', error);
            toast.error('Error during sign out');
          }
        }
        toast.success('Signed out successfully');
        navigate('/');
      }
      if (event === 'USER_UPDATED') {
        toast.success('Profile updated successfully');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <Layout>
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/lovable-uploads/eb177364-44a0-454d-b4ec-3575366e5749.png")',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-md w-full mx-4 p-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl relative z-10">
            <h1 className="text-2xl font-bold text-center mb-6 text-navy">Welcome to TripBuilder</h1>
            <SupabaseAuth 
              supabaseClient={supabase}
              appearance={{ 
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#1a365d',
                      brandAccent: '#2a4a7f',
                    },
                  },
                },
              }}
              providers={[]}
              theme="light"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;