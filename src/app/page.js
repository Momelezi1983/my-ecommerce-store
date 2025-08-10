// src/app/page.js
import { supabase } from '../lib/supabase';
import AddToCartButton from '../components/AddToCartButton';
import BuyButton from '../components/BuyButton';
import styles from './page.module.css';

async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data;
}

export default async function HomePage() {
  const products = await getProducts();
  return (
    <main className="container">
      <h1>Our Products</h1>
      <div className={styles.productGrid}>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p className={styles.price}>${product.price}</p>
              {product.image_url && (
                <img src={product.image_url} alt={product.name} />
              )}
              <div className={styles.buttonGroup}>
                  <AddToCartButton product={product} />
                  <BuyButton product={product} />
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </main>
  );
}

