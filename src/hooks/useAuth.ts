import { useEffect, useState } from 'react';
import { supabase } from '../lib/auth/supabaseClient.js';
import { AuthUser, AuthSession } from '../types/auth.js';

export function useAuth() {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      try {
        const { data: sessionData, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (sessionData.session) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', sessionData.session.user.id)
            .single();

          setSession({
            user: userData,
            access_token: sessionData.session.access_token,
            expires_at: sessionData.session.expires_at,
            isLoading: false,
          });
        } else {
          setSession({
            user: null,
            isLoading: false,
          });
        }
      } catch (err: any) {
        console.error('Session check error:', err);
        setSession({
          user: null,
          isLoading: false,
          error: err.message,
        });
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (currentSession?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();

        setSession({
          user: userData,
          access_token: currentSession.access_token,
          expires_at: currentSession.expires_at,
          isLoading: false,
        });
      } else {
        setSession({
          user: null,
          isLoading: false,
        });
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    setSession((s) => ({ ...s, isLoading: true }));
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) throw error;

      // Create user profile in public.users table
      if (data.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          full_name: fullName,
          tier: 'regular',
          loyalty_points: 0,
        });

        if (profileError) throw profileError;
      }

      return { success: true };
    } catch (err: any) {
      setSession((s) => ({ ...s, error: err.message }));
      return { success: false, error: err.message };
    } finally {
      setSession((s) => ({ ...s, isLoading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    setSession((s) => ({ ...s, isLoading: true }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { success: true };
    } catch (err: any) {
      setSession((s) => ({ ...s, error: err.message }));
      return { success: false, error: err.message };
    } finally {
      setSession((s) => ({ ...s, isLoading: false }));
    }
  };

  const signOut = async () => {
    setSession((s) => ({ ...s, isLoading: true }));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession({ user: null, isLoading: false });
      return { success: true };
    } catch (err: any) {
      setSession((s) => ({ ...s, error: err.message }));
      return { success: false, error: err.message };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    ...session,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
}
