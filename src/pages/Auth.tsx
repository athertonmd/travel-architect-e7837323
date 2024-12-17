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
        navigate('/');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast.success('Successfully signed in!');
        navigate('/');
      }
      if (event === 'SIGNED_OUT') {
        toast.success('Signed out successfully');
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
        className="fixed inset-0 w-full h-full bg-cover bg-center"
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
              onError={(error) => {
                toast.error(error.message);
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;