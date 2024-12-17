import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <Layout>
      <div 
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("/lovable-uploads/7c64f633-610e-49b9-b94d-3ccb799add5d.png")',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="max-w-md w-full mx-4 p-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl">
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
    </Layout>
  );
};

export default Auth;