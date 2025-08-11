// src/app/api/create-checkout-session/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Make sure you have the supabase client imported
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { cartItems, userId } = await req.json();

    // 1. Get product IDs from the simplified cart
    const productIds = cartItems.map((item) => item.id);

    // 2. Fetch full product details from the Supabase database
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, price, image_url')
      .in('id', productIds);

    if (error) {
      throw new Error(error.message);
    }

    // 3. Create line items for Stripe from the fetched product data
    const lineItems = products.map((product) => {
      // Find the quantity for this product from the cartItems
      const cartItem = cartItems.find(item => item.id === product.id);
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: [product.image_url],
          },
          unit_amount: product.price * 100,
        },
        quantity: cartItem.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: {
        userId: userId,
        cartItems: JSON.stringify(cartItems),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
