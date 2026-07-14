"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

type CheckoutProps = {
  clientSecret: string;
  publishableKey: string;
  onComplete: () => void;
};

export default function Checkout({
  clientSecret,
  publishableKey,
  onComplete,
}: CheckoutProps) {
  const stripePromise = loadStripe(publishableKey);

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret, onComplete }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
