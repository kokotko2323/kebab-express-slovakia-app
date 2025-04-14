
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Check if user is an admin
        if (currentSession?.user) {
          const userData = currentSession.user;
          setIsAdmin(userData.app_metadata?.isAdmin === true || userData.user_metadata?.isAdmin === true);
        } else {
          setIsAdmin(false);
        }
        
        if (event === 'SIGNED_IN') {
          toast.success('Úspešne prihlásený!');
        } else if (event === 'SIGNED_OUT') {
          toast.info('Boli ste odhlásení');
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // Check if user is an admin
        if (data.session?.user) {
          const userData = data.session.user;
          setIsAdmin(userData.app_metadata?.isAdmin === true || userData.user_metadata?.isAdmin === true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, phone: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          },
          emailRedirectTo: `${window.location.origin}/profile`
        }
      });
      
      if (error) throw error;
      
      toast.success('Registrácia úspešná! Prosím, skontrolujte svoj email pre potvrdenie účtu.');
    } catch (error: any) {
      let message = 'Nastala chyba pri registrácii';
      if (error.message) {
        if (error.message.includes('already registered')) {
          message = 'Používateľ s týmto emailom už existuje';
        }
      }
      toast.error(message);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
    } catch (error: any) {
      let message = 'Nesprávny email alebo heslo';
      toast.error(message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      toast.error('Nastala chyba pri odhlásení');
      console.error('Error signing out:', error);
    }
  };

  const value = {
    session,
    user,
    isLoading,
    isAdmin,
    signUp,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
