'use server';

import { getProduct } from "@/lib/products";
import { stripe } from "@/lib/stripe";

export async function startCheckoutSession(productId: string): Promise<string> {
  const product = getProduct(productId);

  if (!product) {
    throw new Error("The selected product is unavailable.");
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded_page",
    redirect_on_completion: "never",
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
        },
        quantity: 1,
      },
    ],
  });

  if (!session.client_secret) {
    throw new Error("Stripe did not return a checkout client secret.");
  }

  return session.client_secret;
}
