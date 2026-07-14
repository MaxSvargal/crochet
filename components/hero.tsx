"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GodRays } from "@paper-design/shaders-react";

type Product = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  description: string;
  details: string[];
  images: string[];
};

const products: Product[] = [
  {
    id: "lamp",
    name: "Crochet Top Pattern PDF",
    tagline:
      "Summer Halter Top Tutorial, Mesh Festival Top, Triangle Flow Top, Advanced Beginner",
    price: "$12",
    description:
      "A hand-finished ceramic lamp with a soft linen shade that casts a warm, even glow. Designed to bring a calm, considered light to any corner of your home.",
    details: [
      "Matte-white ceramic base",
      "Natural linen shade",
      "Dimmable warm LED included",
    ],
    images: [
      "/products/listing_1_1.jpg",
      "/products/listing_1_2.jpg",
      "/products/listing_1_3.jpg",
      "/products/listing_1_4.jpg",
      "/products/listing_1_5.jpg",
      "/products/listing_1_6.jpg",
    ],
  },
  // {
  // 	id: 'chair',
  // 	name: 'Halden Lounge Chair',
  // 	tagline: 'Mid-century comfort',
  // 	price: '$849',
  // 	description:
  // 		'A mid-century lounge chair upholstered in full-grain tan leather over a solid walnut frame. Built to age beautifully and support you for decades.',
  // 	details: ['Full-grain tan leather', 'Solid walnut frame', 'Hand-joined construction'],
  // 	images: ['/products/chair-1.png', '/products/chair-2.png', '/products/chair-3.png'],
  // },
  // {
  // 	id: 'mug',
  // 	name: 'Terra Stoneware Mug',
  // 	tagline: 'Made by hand',
  // 	price: '$38',
  // 	description:
  // 		'A generously sized stoneware mug finished in a matte sage glaze. Each piece is thrown by hand, so no two are exactly alike.',
  // 	details: ['Handmade stoneware', 'Matte sage glaze', 'Dishwasher and microwave safe'],
  // 	images: ['/products/mug-1.png', '/products/mug-2.png', '/products/mug-3.png'],
  // },
];

export default function Hero() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);

  const activeProduct = products.find((p) => p.id === activeId) ?? null;

  const handleOpen = (id: string) => {
    setSlide(0);
    setActiveId(id);
  };

  const handleClose = () => {
    setActiveId(null);
  };

  useEffect(() => {
    document.body.style.overflow = activeId ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeId]);

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

            <p className="text-base sm:text-lg md:text-xl leading-[160%] text-black max-w-2xl px-4 text-pretty">
              My grandmother taught me how to crochet when I was six and I’ve
              carried that skill with me ever since. I returned to it years
              later with a new appreciation - for the calm process, the texture,
              and the simple beauty of creating something by hand. I don’t chase
              trends, I follow what feels right. Each piece in this shop is made
              thoughtfully with the hope that it brings comfort and ease to the
              one who wears it. Thanks for stopping by.
            </p>
          </div>

          {/* Product cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 items-center justify-center">
            {products.map((product) => (
              <motion.button
                key={product.id}
                layoutId={`card-${product.id}`}
                onClick={() => handleOpen(product.id)}
                style={{ borderRadius: 24 }}
                className="group relative flex flex-col overflow-hidden bg-[#E9E9E9] text-left transform-gpu will-change-transform"
              >
                <div className="aspect-square w-full overflow-hidden bg-[#DEDEDE]">
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                    {product.price}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {activeProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/40"
            />

            <motion.div
              layoutId={`card-${activeProduct.id}`}
              style={{ borderRadius: 24 }}
              className="relative flex max-h-full w-full max-w-[1100px] overflow-hidden bg-[#EDEDED] transform-gpu will-change-transform"
            >
              <div className="h-full max-h-[92vh] w-full overflow-y-auto scrollbar-hide">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="flex w-full flex-col lg:flex-row"
                >
                  {/* Image carousel */}
                  <div className="relative w-full lg:w-1/2">
                    <div className="relative aspect-square w-full overflow-hidden bg-[#DEDEDE]">
                      <AnimatePresence initial={false} mode="popLayout">
                        <motion.img
                          key={slide}
                          src={
                            activeProduct.images[slide] || "/placeholder.svg"
                          }
                          alt={`${activeProduct.name} view ${slide + 1}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </AnimatePresence>

                      <button
                        onClick={() =>
                          setSlide(
                            (s) =>
                              (s - 1 + activeProduct.images.length) %
                              activeProduct.images.length,
                          )
                        }
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#1A1A1A] backdrop-blur transition-colors hover:bg-white"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          setSlide((s) => (s + 1) % activeProduct.images.length)
                        }
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#1A1A1A] backdrop-blur transition-colors hover:bg-white"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-3 p-4">
                      {activeProduct.images.map((image, index) => (
                        <button
                          key={image}
                          onClick={() => setSlide(index)}
                          aria-label={`Go to image ${index + 1}`}
                          className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors ${
                            slide === index
                              ? "border-[#1A1A1A]"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Details + buy */}
                  <div className="flex w-full flex-col justify-center gap-6 p-6 sm:p-10 lg:w-1/2 lg:p-14">
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] font-mono uppercase tracking-[0.5px] text-[#6B6B6B]">
                        {activeProduct.tagline}
                      </p>
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1A1A1A] leading-none tracking-[-0.03em]">
                        {activeProduct.name}
                      </h2>
                      <p className="text-2xl text-[#1A1A1A]">
                        {activeProduct.price}
                      </p>
                    </div>

                    {/* Buy button — placed above the description */}
                    <button
                      type="button"
                      className="w-full rounded-full bg-[#1A1A1A] px-8 py-3.5 text-base font-medium text-[#F5F5F5] tracking-[-0.01em] transition-colors hover:bg-black"
                    >
                      Buy now
                    </button>

                    <div className="flex flex-col gap-4 border-t border-black/10 pt-6">
                      <p className="text-base leading-[160%] text-[#3A3A3A] text-pretty">
                        {activeProduct.description}
                      </p>
                      <ul className="flex flex-col gap-2">
                        {activeProduct.details.map((detail) => (
                          <li
                            key={detail}
                            className="flex items-start gap-2 text-sm text-[#3A3A3A]"
                          >
                            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1A1A1A]" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#1A1A1A] backdrop-blur transition-colors hover:bg-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
