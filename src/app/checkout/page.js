'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../../cart/cart-context';
import { useAuth } from '../../auth/auth-context';
import styles from './checkout.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { session } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: session?.user?.email || '',
    address: '',
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    const stripe = await stripePromise;

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartItems: cart, userId: session?.user?.id }),
    });

    const data = await response.json();

    if (response.ok) {
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } else {
      console.error('Error from API:', data.error);
    }
  };

  return (
    // Corrected line: Added the missing '<' for the main tag
    <main className="container">
      <h1>Checkout</h1>
      <div className={styles.checkoutLayout}>
        <div className={styles.cartSummary}>
          <h2>Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className={styles.summaryItem}>
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className={styles.total}>
            <h3>Total:</h3>
            <h3>${total.toFixed(2)}</h3>
          </div>
        </div>
        <div className={styles.checkoutForm}>
          <h2>Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="address">Shipping Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button type="submit" className={styles.placeOrderBtn}>
              Pay with Card
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

