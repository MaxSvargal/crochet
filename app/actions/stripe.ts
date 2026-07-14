'use server';

import { getProduct } from "@/lib/products";
import { stripe } from "@/lib/stripe";
import {
  get as head,
  issueSignedToken,
  presignUrl,
} from "@vercel/blob";

const PATTERN_BLOB_PATHNAME =
  "patterns/Triangle_Flow_Top_Crochet_Pattern.pdf";
const DOWNLOAD_URL_LIFETIME_MS = 24 * 60 * 60 * 1000;

export async function startCheckoutSession(
  productId: string,
): Promise<{ clientSecret: string; publishableKey: string }> {
  const product = getProduct(productId);
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  if (!product) {
    throw new Error("The selected product is unavailable.");
  }

  if (!publishableKey) {
    throw new Error("Stripe is not configured. Please try again later.");
  }

  const session = await stripe.checkout.sessions.create({
    // customer_email: "test+location_TH@example.com",
    adaptive_pricing: { enabled: true },
    billing_address_collection: "required", 
    ui_mode: "embedded_page",
    redirect_on_completion: "never",
    mode: "payment",
    branding_settings: {
      background_color: "#EDEDED",
      button_color: "#1A1A1A",
      border_style: "rounded",
      font_family: "inter",
    },
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

  return { clientSecret: session.client_secret, publishableKey };
}

export async function getPatternDownloadUrl(): Promise<string> {
  const validUntil = Date.now() + DOWNLOAD_URL_LIFETIME_MS;
  const oidcToken = process.env.VERCEL_OIDC_TOKEN?.trim();
  const storeId = process.env.BLOB_STORE_ID?.trim();
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  const blobAuthOptions = {} as {
    token?: string;
    oidcToken?: string;
    storeId?: string;
  };

  if (token) {
    blobAuthOptions.token = token;
  } else if (oidcToken) {
    if (!storeId) {
      throw new Error(
        "Missing BLOB_STORE_ID. When using VERCEL_OIDC_TOKEN, you must also set BLOB_STORE_ID.",
      );
    }
    blobAuthOptions.oidcToken = oidcToken;
    blobAuthOptions.storeId = storeId;
  } else {
    throw new Error(
      "Missing Vercel Blob credentials. Set BLOB_READ_WRITE_TOKEN, or set VERCEL_OIDC_TOKEN and BLOB_STORE_ID.",
    );
  }

  try {
    await head(PATTERN_BLOB_PATHNAME, {
      access: "private",
      ...blobAuthOptions,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown Blob head error. Check store ID and token.";
    throw new Error(
      `Blob validation failed for '${PATTERN_BLOB_PATHNAME}': ${message}`,
    );
  }

  const signedToken = await issueSignedToken({
    pathname: PATTERN_BLOB_PATHNAME,
    operations: ["get"],
    validUntil,
    ...blobAuthOptions,
  });

  const { presignedUrl } = await presignUrl(signedToken, {
    access: "private",
    operation: "get",
    pathname: PATTERN_BLOB_PATHNAME,
    validUntil,
  });

  return presignedUrl;
}
