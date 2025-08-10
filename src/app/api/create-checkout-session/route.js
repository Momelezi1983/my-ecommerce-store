// src/app/api/create-checkout-session/route.js
import { NextResponse } from 'next/server';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { cartItems, userId } = await req.json();

    // Create line items for Stripe from the cart data
    const lineItems = cartItems.map((item) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image_url],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
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
