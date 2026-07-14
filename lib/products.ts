export type ProductImage = {
  src: string;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
};

export type ProductContentSection = {
  heading?: string;
  paragraphs?: string[];
  items?: string[];
  emphasized?: boolean;
};

export type Product = {
  id: string;
  name: string;
  tagline: string;
  priceLabel: string;
  priceInCents: number;
  currency: "usd";
  /** Plain-text product copy used by Stripe. */
  description: string;
  images: ProductImage[];
  content: ProductContentSection[];
};

export const products: readonly Product[] = [
  {
    id: "triangle-flow-top-pattern",
    name: "Crochet Top Pattern PDF",
    tagline:
      "Summer Halter Top Tutorial, Mesh Festival Top, Triangle Flow Top, Advanced Beginner",
    priceLabel: "$12",
    priceInCents: 1_200,
    currency: "usd",
    description:
      "Digital PDF crochet pattern for the Triangle Flow Top, including a step-by-step video tutorial.",
    images: [
      { src: "/products/listing_1_1.jpg" },
      { src: "/products/listing_1_2.jpg" },
      { src: "/products/listing_1_3.jpg" },
      { src: "/products/listing_1_4.jpg" },
      { src: "/products/listing_1_5.jpg", objectFit: "contain" },
      { src: "/products/listing_1_6.jpg", objectFit: "contain" },
    ],
    content: [
      { heading: "Digital download — no physical item will be shipped" },
      { paragraphs: ["Follow my instagram: https://www.instagram.com/igoz__"] },
      {
        paragraphs: [
          "Create your own Triangle Flow Top with this detailed crochet pattern and step-by-step video tutorial.",
          "The pattern guides you through making a long-sleeve crochet top using my Triangle Flow stitch design. The sample shown is size S/M, but the construction is customizable, with instructions for adjusting the width, length, neckline, armholes, and sleeves to create your preferred fit.",
        ],
      },
      {
        heading: "What’s included",
        items: [
          "14-page PDF crochet pattern in English",
          "Step-by-step video tutorial",
          "Detailed written instructions",
        ],
      },
      { heading: "Skill level", paragraphs: ["Advanced Beginner"] },
      { heading: "Terminology", paragraphs: ["US crochet terms"] },
      {
        heading: "Materials",
        items: [
          "3.5 mm crochet hook",
          "Approximately 170 g of yarn for the sample shown",
        ],
      },
      {
        heading: "Please note",
        emphasized: true,
        paragraphs: [
          "This is a digital crochet pattern only. No physical item will be shipped.",
          "Due to the nature of digital products, returns, exchanges, and cancellations are not accepted. If you have any questions about the pattern, please feel free to contact me.",
        ],
      },
      {
        heading: "Copyright & terms of use",
        paragraphs: [
          "This pattern is for personal use only.",
          "The pattern, including the PDF file, written instructions, photos, and video tutorial, is protected by copyright. It is strictly prohibited to copy, share, redistribute, republish, resell, translate, reproduce, or edit this pattern, in part or in whole, without the designer’s written permission.",
          "Uploading the PDF, any part of the pattern, or the video tutorial to AI platforms, file-sharing websites, social media, groups, forums, or any other public or private platform is strictly prohibited.",
          "The video tutorial is provided exclusively to purchasers of this pattern. Sharing the video link, screen recording, copying, or reposting the video is not permitted. Creating and publishing tutorials or patterns for the Triangle Flow Top based on this pattern is also prohibited.",
          "You are welcome to sell finished items handmade by you from this pattern in small quantities. Credit to IgozKnits as the designer is appreciated.",
          "When sharing your finished piece online, crediting @igoz__ and using #TriangleFlowTop is greatly appreciated.",
          "Photos from this listing and the pattern may not be used to promote or sell finished items.",
          "© IgozKnits. All rights reserved.",
        ],
      },
    ],
  },
];

export function getProduct(productId: string): Product | undefined {
  return products.find((product) => product.id === productId);
}
