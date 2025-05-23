
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: 'url("/lovable-uploads/eb177364-44a0-454d-b4ec-3575366e5749.png")',
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="absolute top-4 right-4 z-20">
        <img 
          src="/lovable-uploads/d000b7aa-c2ab-4d9e-ac92-9b1e6411fb53.png" 
          alt="TripBuilder Logo" 
          className="w-32 h-auto"
        />
      </div>

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
  );
};

export default Auth;
