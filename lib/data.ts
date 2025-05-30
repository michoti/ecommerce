export interface Variant {
  id: string;
  shade?: string;
  size?: string;
  price: number;
  sku: string;
  stock: number;
  notes?: string[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  images: string[];
  finish?: string;
  coverage?: string;
  shortDescription: string;
  longDescription: string;
  variants: Variant[];
  avgRating: number;
  reviews: {
    id: string;
    rating: number;
    comment: string;
    reviewer: string;
    date: string;
  }[];
}

export interface Collection {
  name: string;
  productIds: number[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  collections: Record<string, Collection>;
}

export interface ProductData {
  lastUpdated: string;
  products: Record<number, Product>;
  categories: Record<string, Category>;
  productReferences: { featured: number[]; bestSellers: number[] };
}



export const productData: ProductData = {
  lastUpdated: "2025-05-29T14:17:00Z",
  products: {
    1: {
      id: 1,
      name: "Classic Matte Lip",
      slug: "classic-matte-lip",
      images: [
        "/products/lipstick-1-front.jpg",
        "/products/lipstick-1-angle.jpg",
        "/products/lipstick-1-swatches.jpg",
        "/products/lipstick-1-packaging.jpg"
      ],
      finish: "Matte",
      shortDescription: "A bold, long-lasting matte lipstick with vibrant color.",
      longDescription: "The Classic Matte Lip offers a rich, velvety finish that stays put for hours. Its highly pigmented formula provides full coverage in a single swipe, perfect for day-to-night wear. Infused with moisturizing ingredients to keep lips comfortable without compromising on staying power.",
      variants: [
        { id: "1a", shade: "Ruby", price: 19.99, sku: "LIP-MAT-RUBY", stock: 100 },
        { id: "1b", shade: "Coral", price: 19.99, sku: "LIP-MAT-CORAL", stock: 80 },
        { id: "1c", shade: "Nude", price: 19.99, sku: "LIP-MAT-NUDE", stock: 120 }
      ],
      avgRating: 4.25,
      reviews: [
        { id: "r1", rating: 4.5, comment: "Love the vibrant Ruby shade! Stays on all day.", reviewer: "Jane D.", date: "2025-04-15" },
        { id: "r2", rating: 4.0, comment: "Nude is perfect for everyday wear, but I wish it was a bit more hydrating.", reviewer: "Sarah K.", date: "2025-05-01" }
      ]
    },
    2: {
      id: 2,
      name: "Satin Lip Color",
      slug: "satin-lip-color",
      images: [
        "/products/lipstick-2-front.jpg",
        "/products/lipstick-2-angle.jpg",
        "/products/lipstick-2-swatches.jpg",
        "/products/lipstick-2-packaging.jpg"
      ],
      finish: "Satin",
      shortDescription: "Smooth satin lipstick with a luminous finish.",
      longDescription: "The Satin Lip Color delivers a luxurious, semi-glossy finish with a creamy texture. Designed for comfort and elegance, this lipstick glides on effortlessly, offering medium coverage with buildable intensity. Ideal for those seeking a sophisticated, polished look.",
      variants: [
        { id: "2a", shade: "Berry", price: 21.99, sku: "LIP-SAT-BERRY", stock: 90 },
        { id: "2b", shade: "Rose", price: 21.99, sku: "LIP-SAT-ROSE", stock: 85 },
        { id: "2c", shade: "Plum", price: 21.99, sku: "LIP-SAT-PLUM", stock: 95 }
      ],
      avgRating: 4.5,
      reviews: [
        { id: "r3", rating: 4.8, comment: "Berry is my go-to shade! Feels so smooth.", reviewer: "Emma L.", date: "2025-03-20" },
        { id: "r4", rating: 4.2, comment: "Rose is lovely but slightly sheer for my taste.", reviewer: "Mia T.", date: "2025-04-10" }
      ]
    },
    3: {
      id: 3,
      name: "Lip Gloss Luxe",
      slug: "lip-gloss-luxe",
      images: [
        "/products/gloss-1-front.jpg",
        "/products/gloss-1-angle.jpg",
        "/products/gloss-1-swatches.jpg",
        "/products/gloss-1-packaging.jpg"
      ],
      finish: "Glossy",
      shortDescription: "High-shine lip gloss with a non-sticky formula.",
      longDescription: "Lip Gloss Luxe provides a mirror-like shine with a lightweight, non-sticky feel. Enriched with hydrating ingredients, it keeps lips soft and glossy for hours. Perfect for a bold, glamorous look or layered over lipstick for added dimension.",
      variants: [
        { id: "3a", shade: "Clear", price: 16.99, sku: "GLS-LUX-CLEAR", stock: 150 },
        { id: "3b", shade: "Pink", price: 16.99, sku: "GLS-LUX-PINK", stock: 130 },
        { id: "3c", shade: "Peach", price: 16.99, sku: "GLS-LUX-PEACH", stock: 140 }
      ],
      avgRating: 4.5,
      reviews: [
        { id: "r5", rating: 4.7, comment: "Clear gloss is perfect over any lipstick!", reviewer: "Lily R.", date: "2025-05-10" },
        { id: "r6", rating: 4.3, comment: "Pink shade is cute, but I reapply often.", reviewer: "Ava S.", date: "2025-05-15" }
      ]
    },
    4: {
      id: 4,
      name: "Hydrating Lip Tint",
      slug: "hydrating-lip-tint",
      images: [
        "/products/tint-1-front.jpg",
        "/products/tint-1-angle.jpg",
        "/products/tint-1-swatches.jpg",
        "/products/tint-1-packaging.jpg"
      ],
      finish: "Natural",
      shortDescription: "Sheer, hydrating lip tint for a natural flush.",
      longDescription: "The Hydrating Lip Tint offers a sheer wash of color with a natural, dewy finish. Infused with nourishing oils, it hydrates lips while providing a subtle, buildable tint. Perfect for a low-maintenance, fresh look.",
      variants: [
        { id: "4a", shade: "Blush", price: 18.99, sku: "TNT-HYD-BLUSH", stock: 110 },
        { id: "4b", shade: "Berry", price: 18.99, sku: "TNT-HYD-BERRY", stock: 100 },
        { id: "4c", shade: "Cherry", price: 18.99, sku: "TNT-HYD-CHERRY", stock: 105 }
      ],
      avgRating: 4.2,
      reviews: [
        { id: "r7", rating: 4.4, comment: "Cherry gives such a natural glow!", reviewer: "Sophie M.", date: "2025-04-25" },
        { id: "r8", rating: 4.0, comment: "Blush is nice but fades a bit quickly.", reviewer: "Olivia P.", date: "2025-05-05" }
      ]
    },
    5: {
      id: 5,
      name: "Satin Finish Foundation",
      slug: "satin-finish-foundation",
      images: [
        "/products/foundation-1-front.jpg",
        "/products/foundation-1-angle.jpg",
        "/products/foundation-1-swatches.jpg",
        "/products/foundation-1-packaging.jpg"
      ],
      coverage: "Medium",
      shortDescription: "Smooth foundation with a satin finish.",
      longDescription: "The Satin Finish Foundation provides medium, buildable coverage with a natural, radiant look. Its lightweight formula blends seamlessly, offering all-day wear with a comfortable, breathable feel. Suitable for all skin types.",
      variants: [
        { id: "5a", shade: "Light", price: 34.99, sku: "FND-SAT-LIGHT", stock: 75, size: "30ml" },
        { id: "5b", shade: "Medium", price: 34.99, sku: "FND-SAT-MEDIUM", stock: 80, size: "30mm" },
        { id: "5c", shade: "Deep", price: 34.99, sku: "FND-SAT-DEEP", stock: 70, size: "30ml" }
      ],
      avgRating: 4.35,
      reviews: [
        { id: "r9", rating: 4.6, comment: "Blends beautifully, perfect for my skin tone.", reviewer: "Emily C.", date: "2025-03-30" },
        { id: "r10", rating: 4.1, comment: "Great coverage, but slightly oily by end of day.", reviewer: "Grace W.", date: "2025-04-20" }
      ]
    },
    6: {
      id: 6,
      name: "Velvet Cream Blush",
      slug: "velvet-cream-blush",
      images: [
        "/products/blush-1-front.jpg",
        "/products/blush-1-angle.jpg",
        "/products/blush-1-swatches.jpg",
        "/products/blush-1-packaging.jpg"
      ],
      finish: "Cream",
      shortDescription: "Creamy blush for a dewy, natural glow.",
      longDescription: "The Velvet Cream Blush melts into the skin for a seamless, radiant flush. Its blendable cream formula offers a natural, dewy finish that lasts all day. Perfect for cheeks and lips for a cohesive look.",
      variants: [
        { id: "6a", shade: "Peach", price: 24.99, sku: "BLH-VEL-PEACH", stock: 90 },
        { id: "6b", shade: "Rose", price: 24.99, sku: "BLH-VEL-ROSE", stock: 85 },
        { id: "6c", shade: "Coral", price: 24.99, sku: "BLH-VEL-CORAL", stock: 95 }
      ],
      avgRating: 4.55,
      reviews: [
        { id: "r11", rating: 4.8, comment: "Peach is so vibrant and blends like a dream!", reviewer: "Chloe B.", date: "2025-05-12" },
        { id: "r12", rating: 4.3, comment: "Rose is pretty but needs reapplication.", reviewer: "Isabella N.", date: "2025-05-18" }
      ]
    },
    7: {
      id: 7,
      name: "Multi-Stick Blush",
      slug: "multi-stick-blush",
      images: [
        "/products/blush-2-front.jpg",
        "/products/blush-2-angle.jpg",
        "/products/blush-2-swatches.jpg",
        "/products/blush-2-packaging.jpg"
      ],
      finish: "Cream",
      shortDescription: "Versatile blush stick for cheeks and lips.",
      longDescription: "The Multi-Stick Blush is a versatile, creamy formula designed for use on cheeks, lips, and even eyes. Its portable stick format makes application effortless, delivering a natural flush with a smooth, blendable texture.",
      variants: [
        { id: "7a", shade: "Pink", price: 22.99, sku: "BLH-MUL-PINK", stock: 100 },
        { id: "7b", shade: "Bronze", price: 22.99, sku: "BLH-MUL-BRONZE", stock: 90 },
        { id: "7c", shade: "Mauve", price: 22.99, sku: "BLH-MUL-MAUVE", stock: 95 }
      ],
      avgRating: 4.25,
      reviews: [
        { id: "r13", rating: 4.5, comment: "Bronze is perfect for a sun-kissed look!", reviewer: "Amelia V.", date: "2025-04-05" },
        { id: "r14", rating: 4.0, comment: "Pink is nice but a bit too sheer for me.", reviewer: "Hannah G.", date: "2025-04-15" }
      ]
    },
    8: {
      id: 8,
      name: "Dewy Highlighter",
      slug: "dewy-highlighter",
      images: [
        "/products/highlighter-1-front.jpg",
        "/products/highlighter-1-angle.jpg",
        "/products/highlighter-1-swatches.jpg",
        "/products/highlighter-1-packaging.jpg"
      ],
      finish: "Dewy",
      shortDescription: "Radiant highlighter for a luminous glow.",
      longDescription: "The Dewy Highlighter adds a radiant, luminous glow to your complexion. Its silky formula blends effortlessly, providing a natural shimmer that catches the light beautifully. Perfect for highlighting cheekbones, brow bones, and more.",
      variants: [
        { id: "8a", shade: "Pearl", price: 21.99, sku: "HGH-DEW-PEARL", stock: 110 },
        { id: "8b", shade: "Gold", price: 21.99, sku: "HGH-DEW-GOLD", stock: 100 },
        { id: "8c", shade: "Rose Gold", price: 21.99, sku: "HGH-DEW-ROSEGOLD", stock: 105 }
      ],
      avgRating: 4.65,
      reviews: [
        { id: "r15", rating: 4.9, comment: "Gold shade gives such a stunning glow!", reviewer: "Zoe T.", date: "2025-05-20" },
        { id: "r16", rating: 4.4, comment: "Pearl is subtle and perfect for daily use.", reviewer: "Ella F.", date: "2025-05-25" }
      ]
    },
    9: {
      id: 9,
      name: "Perfume Classic",
      slug: "perfume-classic",
      images: [
        "/products/perfume-1-front.jpg",
        "/products/perfume-1-angle.jpg",
        "/products/perfume-1-bottle.jpg",
        "/products/perfume-1-packaging.jpg"
      ],
      shortDescription: "Timeless fragrance with floral and woody notes.",
      longDescription: "Perfume Classic is a sophisticated blend of floral, citrus, and woody notes, creating a timeless scent for any occasion. Its long-lasting formula ensures you stay fresh from day to night, perfect for those who love elegance and versatility.",
      variants: [
        { id: "9a", size: "30ml", price: 49.99, sku: "FRG-CLS-30ML", stock: 50, notes: ["Floral", "Citrus", "Woody"] },
        { id: "9b", size: "50ml", price: 69.99, sku: "FRG-CLS-50ML", stock: 40, notes: ["Floral", "Citrus", "Woody"] },
        { id: "9c", size: "100ml", price: 89.99, sku: "FRG-CLS-100ML", stock: 30, notes: ["Floral", "Citrus", "Woody"] }
      ],
      avgRating: 4.45,
      reviews: [
        { id: "r17", rating: 4.7, comment: "Such a luxurious scent, lasts all day!", reviewer: "Victoria H.", date: "2025-03-25" },
        { id: "r18", rating: 4.2, comment: "Love the notes, but the 30ml is a bit small.", reviewer: "Charlotte R.", date: "2025-04-30" }
      ]
    }
  },
  categories: {
    lips: {
      id: "lips",
      name: "Lips",
      image: "/categories/lips.jpg",
      collections: {
        lipsticks: { name: "Lipsticks", productIds: [1, 2] },
        lipGlosses: { name: "Lip Glosses", productIds: [3] },
        lipTints: { name: "Lip Tints", productIds: [4] }
      }
    },
    face: {
      id: "face",
      name: "Face",
      image: "/categories/face.jpg",
      collections: {
        foundations: { name: "Foundations", productIds: [5] },
        blushes: { name: "Blushes", productIds: [6, 7] },
        highlighters: { name: "Highlighters", productIds: [8] }
      }
    },
    eyes: {
      id: "eyes",
      name: "Eyes",
      image: "/categories/eyes.jpg",
      collections: {
        eyeshadows: { name: "Eyeshadows", productIds: [] },
        eyeliners: { name: "Eyeliners", productIds: [] }
      }
    },
    fragrance: {
      id: "fragrance",
      name: "Fragrance",
      image: "/categories/fragrance.jpg",
      collections: {
        perfumes: { name: "Perfumes", productIds: [9] }
      }
    }
  },
  productReferences: {
    featured: [1, 6, 4, 5],
    bestSellers: [7, 3, 8, 9]
  }
};