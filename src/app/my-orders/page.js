'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/auth-context';
import { supabase } from '../../lib/supabase';
import styles from './my-orders.module.css';

export default function MyOrdersPage() {
  const { session } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error.message);
      } else {
        setOrders(data);
      }
      setLoading(false);
    }

    fetchOrders();
  }, [session]);

  if (loading) {
    return (
      <main className="container">
        <h1>My Orders</h1>
        <p>Loading your orders...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="container">
        <h1>My Orders</h1>
        <p>Please log in to view your orders.</p>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className={styles.orderList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <h3>Order ID: {order.id}</h3>
              <p>Total Amount: ${order.total_amount}</p>
              <p>Status: {order.status}</p>
              <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

