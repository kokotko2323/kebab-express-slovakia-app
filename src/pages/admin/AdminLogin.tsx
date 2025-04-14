
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock authentication (in a real app, this would be an API call)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Hard-coded admin credentials (in a real app, use proper authentication)
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
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
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Používateľské meno
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

export default AdminLogin;
