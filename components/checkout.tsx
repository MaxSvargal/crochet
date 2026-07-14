"use client";

import { useMemo } from "react";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

type CheckoutProps = {
  clientSecret: string;
  publishableKey: string;
  onComplete: () => void | Promise<void>;
};

export default function Checkout({
  clientSecret,
  publishableKey,
  onComplete,
}: CheckoutProps) {
  const stripePromise = useMemo(
    () => loadStripe(publishableKey),
    [publishableKey],
  );

  return (
    <div
      id="checkout"
      className="overflow-hidden rounded-2xl bg-[#EDEDED] [&_.StripeElement]:bg-[#EDEDED]"
    >
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret, onComplete }}
      >
        <EmbeddedCheckout className="min-h-[560px] w-full" />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
