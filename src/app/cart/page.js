'use client';

import Link from 'next/link';
import { useCart } from '../../cart/cart-context';
import styles from './cart.module.css';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="container">
      <h1>Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className={styles.cartItems}>
          {cart.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <img src={item.image_url} alt={item.name} className={styles.itemImage} />
              <div className={styles.itemDetails}>
                <h2>{item.name}</h2>
                <p>${item.price.toFixed(2)}</p>
                <div className={styles.quantityControl}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 
1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 
1)}>+</button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} className={styles.removeButton}>
                Remove
              </button>
            </div>
          ))}
          <div className={styles.cartTotal}>
            <h3>Total: ${total.toFixed(2)}</h3>
            {/* Add a Checkout button here */}
            <Link href="/checkout">
              <button className={styles.checkoutButton}>
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

