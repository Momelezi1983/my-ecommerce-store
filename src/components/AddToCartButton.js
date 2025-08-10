// src/components/AddToCartButton.js
'use client';
import { useCart } from '../cart/cart-context';
import styles from './AddToCartButton.module.css'; // Import the CSS module

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  return (
    <button
      onClick={() => addToCart(product)}
      className={styles.button}
    >
      Add to Cart
    </button>
  );
}
