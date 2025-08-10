'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../cart/cart-context';
import styles from './success.module.css';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart when the success page is loaded
    clearCart();
  }, [clearCart]);

  return (
    <main className="container">
      <div className={styles.successContainer}>
        <h1 className={styles.title}>Payment Successful!</h1>
        <p className={styles.message}>Thank you for your purchase. Your order has been placed successfully.</p>
        <Link href="/">
          <button className={styles.homeButton}>
            Continue Shopping
          </button>
        </Link>
      </div>
    </main>
  );
}

