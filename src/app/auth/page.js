// src/app/auth/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../auth/auth-context';
import styles from './page.module.css'; // Import the CSS module

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        alert('Check your email to confirm your account!');
        router.push('/');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authForm}>
        <h1>{isSignUp ? 'Sign Up' : 'Log In'}</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button
            type="submit"
            className={`btn ${isSignUp ? styles.buttonSuccess : styles.buttonPrimary}`}
          >
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        <p className={styles.textCenter} style={{ marginTop: '1rem' }}>
          {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className={styles.linkText}
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
