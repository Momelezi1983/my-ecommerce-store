'use client';

import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/auth-context';
import { useCart } from '../cart/cart-context';
import styles from './Header.module.css';

export default function Header() {
  const { session } = useAuth();
  const { cart } = useCart();
  const cartItemCount = cart.length;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Logout error:', error.message);
  };

  return (
    <header className={styles.header}>
      <Link href="/">
        <h1 className={styles.title}>E-commerce Store</h1>
      </Link>
      <div className={styles.navLinks}>
        <Link href="/cart">
          <button className={`${styles.button} ${styles.buttonPrimary}`}>
            Cart ({cartItemCount})
          </button>
        </Link>
        {session ? (
          <button onClick={handleLogout} className={`${styles.button} ${styles.buttonDanger}`}>
            Logout
          </button>
        ) : (
          <Link href="/auth">
            <button className={`${styles.button} ${styles.buttonSuccess}`}>
              Login
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
