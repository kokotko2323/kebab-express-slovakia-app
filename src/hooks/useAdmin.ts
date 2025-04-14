
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useAdmin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const checkAdminStatus = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session?.user) {
        navigate('/admin/login');
        return false;
      }
      
      const isAdmin = data.session.user.app_metadata?.isAdmin === true || 
                     data.session.user.user_metadata?.isAdmin === true;
      
      if (!isAdmin) {
        toast.error('Prístup zamietnutý. Nemáte oprávnenie pre túto stránku.');
        navigate('/admin/login');
        return false;
      }
      
      setIsAdmin(true);
      return true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      toast.error('Nastala chyba pri overovaní admin prístupu');
      navigate('/admin/login');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.info('Boli ste odhlásení.');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Nastala chyba pri odhlásení');
    }
  };
  
  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);
  
  return {
    isAdmin,
    isLoading,
    handleLogout
  };
}
