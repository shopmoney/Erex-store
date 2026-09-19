export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  priceUsd?: string;
  checkoutUrl: string;
  imageUrl?: string;
  category?: string;
  badge?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const INITIAL_SEED_PRODUCT: Omit<Product, 'id'> = {
  title: "The Ultimate Guide to Using AI in Computer-Related Careers (2026 Edition)",
  description: "A comprehensive guide to the cheapest, smartest AI workflows for tech and computer-related careers — which tools to use, why, and how to combine them.",
  price: "3,500 NGN",
  priceUsd: "$2.50",
  checkoutUrl: "https://selar.co/4d987177xw",
  imageUrl: "https://files.selar.co/product-images/2026/products/godwinobinnaemejuobi/the-ultimate-guide-to-usi-selar.com-6a6e5d3f1f66b.png",
  category: "AI Workflow Guide",
  badge: "Featured Guide",
  createdAt: new Date().toISOString()
};
