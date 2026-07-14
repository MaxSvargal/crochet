"use client";

import { startTransition, useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GodRays } from "@paper-design/shaders-react";
import { startCheckoutSession } from "@/app/actions/stripe";
import Checkout from "@/components/checkout";
import { products } from "@/lib/products";

type HeroProps = {
  stripePublishableKey: string;
};

export default function Hero({ stripePublishableKey }: HeroProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [checkoutClientSecret, setCheckoutClientSecret] = useState<
    string | null
  >(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [isPurchaseComplete, setIsPurchaseComplete] = useState(false);

  const activeProduct = products.find((p) => p.id === activeId) ?? null;

  const resetProductView = (id: string | null) => {
    setSlide(0);
    setActiveId(id);
    setCheckoutClientSecret(null);
    setCheckoutError(null);
    setIsPurchaseComplete(false);
  };

  const handleOpen = (id: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("product", id);
    window.history.pushState(null, "", url);
    resetProductView(id);
  };

  const handleClose = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("product");
    window.history.replaceState(null, "", url);
    resetProductView(null);
  };

  const handleBuy = (productId: string) => {
    if (!stripePublishableKey) {
      setCheckoutError("Stripe is not configured. Please try again later.");
      return;
    }

    setCheckoutError(null);
    setIsStartingCheckout(true);

    startTransition(async () => {
      try {
        const clientSecret = await startCheckoutSession(productId);
        setCheckoutClientSecret(clientSecret);
      } catch {
        setCheckoutError("Unable to start checkout. Please try again.");
      } finally {
        setIsStartingCheckout(false);
      }
    });
  };

  useEffect(() => {
    document.body.style.overflow = activeId ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeId]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateScreenSize = () => setIsLargeScreen(mediaQuery.matches);

    updateScreenSize();
    mediaQuery.addEventListener("change", updateScreenSize);
    return () => mediaQuery.removeEventListener("change", updateScreenSize);
  }, []);

  useEffect(() => {
    // Keep the catalog's first image warm before it is moved into the modal.
    products.forEach((product) => {
      const firstImage = product.images[0];
      if (firstImage) {
        const preload = new Image();
        preload.src = firstImage.src;
      }
    });

    const syncProductFromUrl = () => {
      const productId = new URLSearchParams(window.location.search).get(
        "product",
      );
      resetProductView(
        products.some((product) => product.id === productId) ? productId : null,
      );
    };

    syncProductFromUrl();
    window.addEventListener("popstate", syncProductFromUrl);
    return () => window.removeEventListener("popstate", syncProductFromUrl);
  }, []);

  const renderLinkedText = (text: string) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.split(urlPattern).map((part, index) =>
      part.startsWith("http://") || part.startsWith("https://") ? (
        <a
          key={`${part}-${index}`}
          href={part}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-black/30 underline-offset-4 transition-colors hover:text-black hover:decoration-black"
        >
          {part}
        </a>
      ) : (
        part
      ),
    );
  };

  const selectSlide = (nextSlide: number) => {
    setSlide(nextSlide);
  };

  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        {/* GodRays Background */}
        <div className="absolute inset-0">
          <GodRays
            colorBack="#00000000"
            colors={["#FFFFFF6E", "#F3F3F3F0", "#8A8A8A", "#989898"]}
            colorBloom="#FFFFFF"
            offsetX={0.85}
            offsetY={-1}
            intensity={1}
            spotty={0.45}
            midSize={10}
            midIntensity={0}
            density={0.12}
            bloom={0.15}
            speed={1}
            scale={1.6}
            frame={3332042.8159981333}
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </div>

        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-6 sm:gap-8 text-center">
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[90%] tracking-[-0.03em] text-black mix-blend-exclusion max-w-2xl text-balance">
              IgozKnits
            </h1>

            <p className="text-base sm:text-lg md:text-xl leading-[160%] text-black max-w-3xl px-4 text-pretty">
              For the calm process, the texture, and the simple beauty of
              creating something by hand. Each piece in this shop is made
              thoughtfully with the hope that it brings comfort and ease to the
              one who wears it. Thanks for stopping by.
            </p>
          </div>

          {/* Product cards */}
          <div className="grid w-full max-w-sm grid-cols-1 place-items-center gap-4 sm:gap-5">
            {products.map((product) => (
              <motion.button
                key={product.id}
                layoutId={`card-${product.id}`}
                layout={isLargeScreen ? undefined : "position"}
                onClick={() => handleOpen(product.id)}
                style={{ borderRadius: 24 }}
                className="group relative flex w-full cursor-pointer flex-col overflow-hidden bg-[#E9E9E9] text-left transform-gpu will-change-transform"
              >
                <div className="aspect-[5/6] w-full overflow-hidden bg-[#E9E9E9] sm:aspect-[3/4]">
                  <img
                    src={product.images[0]?.src || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                    style={{
                      objectFit: product.images[0]?.objectFit ?? "cover",
                      objectPosition:
                        product.images[0]?.objectPosition ?? "center center",
                    }}
                  />
                </div>
                <div className="flex items-center justify-between gap-2 p-4 sm:p-5">
                  <div>
                    <p className="text-base sm:text-xl text-[#1A1A1A] tracking-[-0.01em]">
                      {product.name}
                    </p>
                    <p className="text-md text-[#6B6B6B]">{product.tagline}</p>
                  </div>
                  <span className="text-base sm:text-2xl text-[#1A1A1A] ml-4">
                    {product.priceLabel}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {activeProduct && (
          <motion.div
            layoutScroll
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/40"
            />

            <motion.div
              layoutId={`card-${activeProduct.id}`}
              layout={isLargeScreen ? undefined : "position"}
              style={{ borderRadius: 24 }}
              className="relative mx-auto flex w-full max-w-[1280px] overflow-hidden bg-[#EDEDED] shadow-[0_20px_60px_rgba(0,0,0,0.18)] transform-gpu will-change-transform"
            >
              <div className="w-full overflow-hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="flex w-full flex-col lg:flex-row lg:items-start"
                >
                  {/* Image carousel */}
                  <div className="relative w-full lg:sticky lg:top-0 lg:w-1/2 lg:self-start lg:pt-0">
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2F2F2] sm:aspect-[4/5] lg:aspect-[3/4] lg:rounded-none lg:mt-0">
                      <a
                        href={
                          activeProduct.images[slide]?.src || "/placeholder.svg"
                        }
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${activeProduct.name} view ${slide + 1} in a new tab`}
                        className="absolute inset-0 block cursor-zoom-in"
                      >
                        <AnimatePresence initial={false} mode="popLayout">
                          <motion.img
                            key={activeProduct.images[slide]?.src}
                            src={
                              activeProduct.images[slide]?.src ||
                              "/placeholder.svg"
                            }
                            alt={`${activeProduct.name} view ${slide + 1}`}
                            initial={{
                              opacity: 0,
                              scale: 1.025,
                            }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{
                              opacity: 0,
                              scale: 1.025,
                            }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute inset-0 h-full w-full"
                            style={{
                              objectFit:
                                activeProduct.images[slide]?.objectFit ??
                                "cover",
                              objectPosition:
                                activeProduct.images[slide]?.objectPosition ??
                                "center center",
                            }}
                          />
                        </AnimatePresence>
                      </a>

                      <button
                        onClick={() =>
                          selectSlide(
                            (slide - 1 + activeProduct.images.length) %
                              activeProduct.images.length,
                          )
                        }
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-[#1A1A1A] backdrop-blur transition-colors hover:bg-white"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          selectSlide(
                            (slide + 1) % activeProduct.images.length,
                          )
                        }
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-[#1A1A1A] backdrop-blur transition-colors hover:bg-white"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-3 px-4 pb-4 pt-2">
                      {activeProduct.images.map((image, index) => (
                        <button
                          key={image.src}
                          onClick={() => selectSlide(index)}
                          aria-label={`Go to image ${index + 1}`}
                          className={`h-16 w-16 cursor-pointer overflow-hidden rounded-lg border-2 transition-colors ${
                            slide === index
                              ? "border-[#1A1A1A]"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={image.src || "/placeholder.svg"}
                            alt=""
                            className="h-full w-full"
                            style={{
                              objectFit: image.objectFit ?? "cover",
                              objectPosition:
                                image.objectPosition ?? "center center",
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Details + buy */}
                  <div className="flex w-full flex-col justify-start gap-6 p-6 sm:p-10 lg:w-1/2 lg:max-h-[calc(92vh-2rem)] lg:overflow-y-auto lg:p-14">
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] font-mono uppercase tracking-[0.5px] text-[#6B6B6B]">
                        {activeProduct.tagline}
                      </p>
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1A1A1A] leading-none tracking-[-0.03em]">
                        {activeProduct.name}
                      </h2>
                      <p className="text-4xl text-[#1A1A1A]">
                        {activeProduct.priceLabel}
                      </p>
                    </div>

                    {isPurchaseComplete ? (
                      <p className="rounded-2xl border border-black/10 bg-white/60 p-4 text-base text-[#3A3A3A]">
                        Payment complete. Thank you for your purchase!
                      </p>
                    ) : checkoutClientSecret ? (
                      <Checkout
                        clientSecret={checkoutClientSecret}
                        publishableKey={stripePublishableKey}
                        onComplete={() => setIsPurchaseComplete(true)}
                      />
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleBuy(activeProduct.id)}
                          disabled={isStartingCheckout}
                          className="w-full cursor-pointer rounded-full bg-[#1A1A1A] px-8 py-3.5 text-base font-medium text-[#F5F5F5] tracking-[-0.01em] transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isStartingCheckout ? "Opening checkout…" : "Buy now"}
                        </button>
                        {checkoutError && (
                          <p className="text-sm text-red-700" role="alert">
                            {checkoutError}
                          </p>
                        )}
                        <div className="flex flex-col gap-5 border-t border-black/10 pt-6 text-base leading-[170%] text-[#3A3A3A]">
                          {activeProduct.content.map((section, index) => (
                            <div
                              key={`${section.heading ?? "content"}-${index}`}
                              className={
                                section.emphasized
                                  ? "space-y-2 rounded-2xl border border-black/10 bg-white/60 p-4"
                                  : "space-y-2"
                              }
                            >
                              {section.heading && (
                                <h3 className="text-xs mt-4 font-semibold uppercase tracking-[0.28em] text-[#1A1A1A]">
                                  {section.heading}
                                </h3>
                              )}
                              {section.paragraphs?.map((paragraph) => (
                                <p key={paragraph}>
                                  {renderLinkedText(paragraph)}
                                </p>
                              ))}
                              {section.items && (
                                <ul className="flex flex-col gap-2">
                                  {section.items.map((item) => (
                                    <li key={item}>• {item}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/80 text-[#1A1A1A] backdrop-blur transition-colors hover:bg-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
