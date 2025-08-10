'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '../cart/cart-context';
import styles from './BuyButton.module.css';

export default function BuyButton({ product }) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleBuyNow = () => {
    addToCart(product);
    router.push('/checkout');
  };

  return (
    <button onClick={handleBuyNow} className={styles.buyButton}>
      Buy Now
    </button>
  );
}

