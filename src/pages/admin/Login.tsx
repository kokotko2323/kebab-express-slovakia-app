
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Check if already logged in as admin
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session?.user) {
        const isAdmin = data.session.user.app_metadata?.isAdmin === true || 
                       data.session.user.user_metadata?.isAdmin === true;
        
        if (isAdmin) {
          navigate('/admin/dashboard');
        }
      }
    };
    
    checkAdmin();
  }, [navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Hard-coded admin credentials
      if (email === 'Ankarakebab' && password === 'Ankara2025Kebab') {
        // Try to find an existing admin account
        const { data: existingUser, error: lookupError } = await supabase.auth
          .signInWithPassword({
            email: 'admin@kebab-express.com',
            password: password
          });
        
        // If admin doesn't exist, create one
        if (lookupError && lookupError.message.includes('Invalid login credentials')) {
          // Create admin account
          const { error: signUpError } = await supabase.auth.signUp({
            email: 'admin@kebab-express.com',
            password: password,
            options: {
              data: {
                isAdmin: true,
                name: 'Admin'
              }
            }
          });
          
          if (signUpError) throw signUpError;
          
          // Sign in with new account
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: 'admin@kebab-express.com',
            password: password
          });
          
          if (signInError) throw signInError;
        }
        
        toast.success('Prihlásenie úspešné!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Nesprávne prihlasovacie údaje.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Nastala chyba pri prihlásení.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-kebab-primary">Kebab Express</h1>
          <p className="text-gray-500 mt-2">Administračný panel</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Používateľské meno
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
              autoComplete="username"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Heslo
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
              autoComplete="current-password"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-kebab-primary hover:bg-kebab-primary/90 py-6"
            disabled={isLoading}
          >
            {isLoading ? 'Prihlasovanie...' : 'Prihlásiť sa'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
