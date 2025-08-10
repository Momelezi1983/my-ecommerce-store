import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase with your URL and service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const sig = req.headers.get('stripe-signature');
  const payload = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const { userId, cartItems } = session.metadata;

    try {
      // Parse the cart items from the metadata
      const items = JSON.parse(cartItems);

      // Insert the new order into the 'orders' table
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Prepare the items for insertion into the 'order_items' table
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
      }));

      // Insert the order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      console.log('Order and items saved to Supabase successfully!');

      // Return a 200 to Stripe to acknowledge the event
      return NextResponse.json({ received: true });
    } catch (error) {
      console.error('Error handling webhook:', error);
      return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

