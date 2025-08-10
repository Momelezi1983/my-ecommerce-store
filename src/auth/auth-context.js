'use client'; // This is a Client Component

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    // Fetch the initial session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching initial session:', error);
      } else {
        setSession(session);
      }
      setLoading(false);
    };

    getSession();

    // Cleanup the subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

