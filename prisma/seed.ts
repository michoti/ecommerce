import { PrismaClient } from "@/app/generated/prisma"

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Clear existing data in correct order (respecting foreign key constraints)
  await prisma.review.deleteMany({})
  await prisma.variant.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.collection.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.coupon.deleteMany({})

  console.log('Cleared existing data')

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Lips',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Face',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Eyes',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fragrance',
      },
    }),
  ])

  const [lipsCategory, faceCategory, eyesCategory, fragranceCategory] = categories
  console.log('Created categories')

  // Create products with variants and reviews
  const products = []

  // Product 1: Classic Matte Lip
  const product1 = await prisma.product.create({
    data: {
      name: 'Classic Matte Lip',
      slug: 'classic-matte-lip',
      shortDescription: 'A bold, long-lasting matte lipstick with vibrant color.',
      longDescription: 'The Classic Matte Lip offers a rich, velvety finish that stays put for hours. Its highly pigmented formula provides full coverage in a single swipe, perfect for day-to-night wear. Infused with moisturizing ingredients to keep lips comfortable without compromising on staying power.',
      finish: 'Matte',
      avgRating: 4.25,
      images: [
        '/products/lipstick-1-front.jpg',
        '/products/lipstick-1-angle.jpg',
        '/products/lipstick-1-swatches.jpg',
        '/products/lipstick-1-packaging.jpg'
      ],
      variants: {
        create: [
          { shade: 'Ruby', price: 19.99, sku: 'LIP-MAT-RUBY', stock: 100 },
          { shade: 'Coral', price: 19.99, sku: 'LIP-MAT-CORAL', stock: 80 },
          { shade: 'Nude', price: 19.99, sku: 'LIP-MAT-NUDE', stock: 120 },
        ],
      },
      reviews: {
        create: [
          {
            rating: 4.5,
            comment: 'Love the vibrant Ruby shade! Stays on all day.',
            reviewer: 'Jane D.',
            createdAt: new Date('2025-04-15'),
          },
          {
            rating: 4.0,
            comment: 'Nude is perfect for everyday wear, but I wish it was a bit more hydrating.',
            reviewer: 'Sarah K.',
            createdAt: new Date('2025-05-01'),
          },
        ],
      },
    },
  })
  products.push(product1)

  // Product 2: Satin Lip Color
  const product2 = await prisma.product.create({
    data: {
      name: 'Satin Lip Color',
      slug: 'satin-lip-color',
      shortDescription: 'Smooth satin lipstick with a luminous finish.',
      longDescription: 'The Satin Lip Color delivers a luxurious, semi-glossy finish with a creamy texture. Designed for comfort and elegance, this lipstick glides on effortlessly, offering medium coverage with buildable intensity. Ideal for those seeking a sophisticated, polished look.',
      finish: 'Satin',
      avgRating: 4.5,
      images: [
        '/products/lipstick-2-front.jpg',
        '/products/lipstick-2-angle.jpg',
        '/products/lipstick-2-swatches.jpg',
        '/products/lipstick-2-packaging.jpg'
      ],
      variants: {
        create: [
          { shade: 'Berry', price: 21.99, sku: 'LIP-SAT-BERRY', stock: 90 },
          { shade: 'Rose', price: 21.99, sku: 'LIP-SAT-ROSE', stock: 85 },
          { shade: 'Plum', price: 21.99, sku: 'LIP-SAT-PLUM', stock: 95 },
        ],
      },
      reviews: {
        create: [
          {
            rating: 4.8,
            comment: 'Berry is my go-to shade! Feels so smooth.',
            reviewer: 'Emma L.',
            createdAt: new Date('2025-03-20'),
          },
          {
            rating: 4.2,
            comment: 'Rose is lovely but slightly sheer for my taste.',
            reviewer: 'Mia T.',
            createdAt: new Date('2025-04-10'),
          },
        ],
      },
    },
  })
  products.push(product2)

  // Product 3: Lip Gloss Luxe
  const product3 = await prisma.product.create({
    data: {
      name: 'Lip Gloss Luxe',
      slug: 'lip-gloss-luxe',
      shortDescription: 'High-shine lip gloss with a non-sticky formula.',
      longDescription: 'Lip Gloss Luxe provides a mirror-like shine with a lightweight, non-sticky feel. Enriched with hydrating ingredients, it keeps lips soft and glossy for hours. Perfect for a bold, glamorous look or layered over lipstick for added dimension.',
      finish: 'Glossy',
      avgRating: 4.5,
      images: [
        '/products/gloss-1-front.jpg',
        '/products/gloss-1-angle.jpg',
        '/products/gloss-1-swatches.jpg',
        '/products/gloss-1-packaging.jpg'
      ],
      variants: {
        create: [
          { shade: 'Clear', price: 16.99, sku: 'GLS-LUX-CLEAR', stock: 150 },
          { shade: 'Pink', price: 16.99, sku: 'GLS-LUX-PINK', stock: 130 },
          { shade: 'Peach', price: 16.99, sku: 'GLS-LUX-PEACH', stock: 140 },
        ],
      },
      reviews: {
        create: [
          {
            rating: 4.7,
            comment: 'Clear gloss is perfect over any lipstick!',
            reviewer: 'Lily R.',
            createdAt: new Date('2025-05-10'),
          },
          {
            rating: 4.3,
            comment: 'Pink shade is cute, but I reapply often.',
            reviewer: 'Ava S.',
            createdAt: new Date('2025-05-15'),
          },
        ],
      },
    },
  })
  products.push(product3)

  // Product 4: Hydrating Lip Tint
  const product4 = await prisma.product.create({
    data: {
      name: 'Hydrating Lip Tint',
      slug: 'hydrating-lip-tint',
      shortDescription: 'Sheer, hydrating lip tint for a natural flush.',
      longDescription: 'The Hydrating Lip Tint offers a sheer wash of color with a natural, dewy finish. Infused with nourishing oils, it hydrates lips while providing a subtle, buildable tint. Perfect for a low-maintenance, fresh look.',
      finish: 'Natural',
      avgRating: 4.2,
      images: [
        '/products/tint-1-front.jpg',
        '/products/tint-1-angle.jpg',
        '/products/tint-1-swatches.jpg',
        '/products/tint-1-packaging.jpg'
      ],
      variants: {
        create: [
          { shade: 'Blush', price: 18.99, sku: 'TNT-HYD-BLUSH', stock: 110 },
          { shade: 'Berry', price: 18.99, sku: 'TNT-HYD-BERRY', stock: 100 },
          { shade: 'Cherry', price: 18.99, sku: 'TNT-HYD-CHERRY', stock: 105 },
        ],
      },
      reviews: {
        create: [
          {
            rating: 4.4,
            comment: 'Cherry gives such a natural glow!',
            reviewer: 'Sophie M.',
            createdAt: new Date('2025-04-25'),
          },
          {
            rating: 4.0,
            comment: 'Blush is nice but fades a bit quickly.',
            reviewer: 'Olivia P.',
            createdAt: new Date('2025-05-05'),
          },
        ],
      },
    },
  })
  products.push(product4)

  // Product 5: Satin Finish Foundation
  const product5 = await prisma.product.create({
    data: {
      name: 'Satin Finish Foundation',
      slug: 'satin-finish-foundation',
      shortDescription: 'Smooth foundation with a satin finish.',
      longDescription: 'The Satin Finish Foundation provides medium, buildable coverage with a natural, radiant look. Its lightweight formula blends seamlessly, offering all-day wear with a comfortable, breathable feel. Suitable for all skin types.',
      coverage: 'Medium',
      avgRating: 4.35,
      images: [
        '/products/foundation-1-front.jpg',
        '/products/foundation-1-angle.jpg',
        '/products/foundation-1-swatches.jpg',
        '/products/foundation-1-packaging.jpg'
      ],
      variants: {
        create: [
          { shade: 'Light', price: 34.99, sku: 'FND-SAT-LIGHT', stock: 75, size: '30ml' },
          { shade: 'Medium', price: 34.99, sku: 'FND-SAT-MEDIUM', stock: 80, size: '30ml' },
          { shade: 'Deep', price: 34.99, sku: 'FND-SAT-DEEP', stock: 70, size: '30ml' },
        ],
      },
      reviews: {
        create: [
          {
            rating: 4.6,
            comment: 'Blends beautifully, perfect for my skin tone.',
            reviewer: 'Emily C.',
            createdAt: new Date('2025-03-30'),
          },
          {
            rating: 4.1,
            comment: 'Great coverage, but slightly oily by end of day.',
            reviewer: 'Grace W.',
            createdAt: new Date('2025-04-20'),
          },
        ],
      },
    },
  })
  products.push(product5)

  // Product 6: Velvet Cream Blush
  const product6 = await prisma.product.create({
    data: {
      name: 'Velvet Cream Blush',
      slug: 'velvet-cream-blush',
      shortDescription: 'Creamy blush for a dewy, natural glow.',
      longDescription: 'The Velvet Cream Blush melts into the skin for a seamless, radiant flush. Its blendable cream formula offers a natural, dewy finish that lasts all day. Perfect for cheeks and lips for a cohesive look.',
      finish: 'Cream',
      avgRating: 4.55,
      images: [
        '/products/blush-1-front.jpg',
        '/products/blush-1-angle.jpg',
        '/products/blush-1-swatches.jpg',
        '/products/blush-1-packaging.jpg'
      ],
      variants: {
        create: [
          { shade: 'Peach', price: 24.99, sku: 'BLH-VEL-PEACH', stock: 90 },
          { shade: 'Rose', price: 24.99, sku: 'BLH-VEL-ROSE', stock: 85 },
          { shade: 'Coral', price: 24.99, sku: 'BLH-VEL-CORAL', stock: 95 },
        ],
      },
      reviews: {
        create: [
          {
            rating: 4.8,
            comment: 'Peach is so vibrant and blends like a dream!',
            reviewer: 'Chloe B.',
            createdAt: new Date('2025-05-12'),
          },
          {
            rating: 4.3,
            comment: 'Rose is pretty but needs reapplication.',
            reviewer: 'Isabella N.',
            createdAt: new Date('2025-05-18'),
          },
        ],
      },
    },
  })
  products.push(product6)

  // Product 7: Multi-Stick Blush
  const product7 = await prisma.product.create({
    data: {
      name: 'Multi-Stick Blush',
      slug: 'multi-stick-blush',
      shortDescription: 'Versatile blush stick for cheeks and lips.',
      longDescription: 'The Multi-Stick Blush is a versatile, creamy formula designed for use on cheeks, lips, and even eyes. Its portable stick format makes application effortless, delivering a natural flush with a smooth, blendable texture.',
      finish: 'Cream',
      avgRating: 4.25,
      images: [
        '/products/blush-2-front.jpg',
        '/products/blush-2-angle.jpg',
        '/products/blush-2-swatches.jpg',
        '/products/blush-2-packaging.jpg'
      ],
      variants: {
        create: [
          { shade: 'Pink', price: 22.99, sku: 'BLH-MUL-PINK', stock: 100 },
          { shade: 'Bronze', price: 22.99, sku: 'BLH-MUL-BRONZE', stock: 90 },
          { shade: 'Mauve', price: 22.99, sku: 'BLH-MUL-MAUVE', stock: 95 },
        ],
      },
      reviews: {
        create: [
          {
            rating: 4.5,
            comment: 'Bronze is perfect for a sun-kissed look!',
            reviewer: 'Amelia V.',
            createdAt: new Date('2025-04-05'),
          },
          {
            rating: 4.0,
            comment: 'Pink is nice but a bit too sheer for me.',
            reviewer: 'Hannah G.',
            createdAt: new Date('2025-04-15'),
          },
        ],
      },
    },
  })
  products.push(product7)

  // Product 8: Dewy Highlighter
  const product8 = await prisma.product.create({
    data: {
      name: 'Dewy Highlighter',
      slug: 'dewy-highlighter',
      shortDescription: 'Radiant highlighter for a luminous glow.',
      longDescription: 'The Dewy Highlighter adds a radiant, luminous glow to your complexion. Its silky formula blends effortlessly, providing a natural shimmer that catches the light beautifully. Perfect for highlighting cheekbones, brow bones, and more.',
      finish: 'Dewy',
      avgRating: 4.65,
      images: [
        '/products/highlighter-1-front.jpg',
        '/products/highlighter-1-angle.jpg',
        '/products/highlighter-1-swatches.jpg',
        '/products/highlighter-1-packaging.jpg'
      ],
      variants: {
        create: [
          { shade: 'Pearl', price: 21.99, sku: 'HGH-DEW-PEARL', stock: 110 },
          { shade: 'Gold', price: 21.99, sku: 'HGH-DEW-GOLD', stock: 100 },
          { shade: 'Rose Gold', price: 21.99, sku: 'HGH-DEW-ROSEGOLD', stock: 105 },
        ],
      },
      reviews: {
        create: [
          {
            rating: 4.9,
            comment: 'Gold shade gives such a stunning glow!',
            reviewer: 'Zoe T.',
            createdAt: new Date('2025-05-20'),
          },
          {
            rating: 4.4,
            comment: 'Pearl is subtle and perfect for daily use.',
            reviewer: 'Ella F.',
            createdAt: new Date('2025-05-25'),
          },
        ],
      },
    },
  })
  products.push(product8)

  // Product 9: Perfume Classic
  const product9 = await prisma.product.create({
    data: {
      name: 'Perfume Classic',
      slug: 'perfume-classic',
      shortDescription: 'Timeless fragrance with floral and woody notes.',
      longDescription: 'Perfume Classic is a sophisticated blend of floral, citrus, and woody notes, creating a timeless scent for any occasion. Its long-lasting formula ensures you stay fresh from day to night, perfect for those who love elegance and versatility.',
      avgRating: 4.45,
      images: [
        '/products/perfume-1-front.jpg',
        '/products/perfume-1-angle.jpg',
        '/products/perfume-1-bottle.jpg',
        '/products/perfume-1-packaging.jpg'
      ],
      variants: {
        create: [
          { size: '30ml', price: 49.99, sku: 'FRG-CLS-30ML', stock: 50 },
          { size: '50ml', price: 69.99, sku: 'FRG-CLS-50ML', stock: 40 },
          { size: '100ml', price: 89.99, sku: 'FRG-CLS-100ML', stock: 30 },
        ],
      },
      reviews: {
        create: [
          {
            rating: 4.7,
            comment: 'Such a luxurious scent, lasts all day!',
            reviewer: 'Victoria H.',
            createdAt: new Date('2025-03-25'),
          },
          {
            rating: 4.2,
            comment: 'Love the notes, but the 30ml is a bit small.',
            reviewer: 'Charlotte R.',
            createdAt: new Date('2025-04-30'),
          },
        ],
      },
    },
  })
  products.push(product9)

  console.log('Created products with variants and reviews')

  // Create collections and connect products
  const collections = []

  // Lips collections
  const lipsticksCollection = await prisma.collection.create({
    data: {
      name: 'Lipsticks',
      categoryId: lipsCategory.id,
      products: {
        connect: [{ id: product1.id }, { id: product2.id }],
      },
    },
  })
  collections.push(lipsticksCollection)

  const lipGlossesCollection = await prisma.collection.create({
    data: {
      name: 'Lip Glosses',
      categoryId: lipsCategory.id,
      products: {
        connect: [{ id: product3.id }],
      },
    },
  })
  collections.push(lipGlossesCollection)

  const lipTintsCollection = await prisma.collection.create({
    data: {
      name: 'Lip Tints',
      categoryId: lipsCategory.id,
      products: {
        connect: [{ id: product4.id }],
      },
    },
  })
  collections.push(lipTintsCollection)

  // Face collections
  const foundationsCollection = await prisma.collection.create({
    data: {
      name: 'Foundations',
      categoryId: faceCategory.id,
      products: {
        connect: [{ id: product5.id }],
      },
    },
  })
  collections.push(foundationsCollection)

  const blushesCollection = await prisma.collection.create({
    data: {
      name: 'Blushes',
      categoryId: faceCategory.id,
      products: {
        connect: [{ id: product6.id }, { id: product7.id }],
      },
    },
  })
  collections.push(blushesCollection)

  const highlightersCollection = await prisma.collection.create({
    data: {
      name: 'Highlighters',
      categoryId: faceCategory.id,
      products: {
        connect: [{ id: product8.id }],
      },
    },
  })
  collections.push(highlightersCollection)

  // Eyes collections (empty as per data)
  const eyeshadowsCollection = await prisma.collection.create({
    data: {
      name: 'Eyeshadows',
      categoryId: eyesCategory.id,
    },
  })
  collections.push(eyeshadowsCollection)

  const eyelinersCollection = await prisma.collection.create({
    data: {
      name: 'Eyeliners',
      categoryId: eyesCategory.id,
    },
  })
  collections.push(eyelinersCollection)

  // Fragrance collections
  const perfumesCollection = await prisma.collection.create({
    data: {
      name: 'Perfumes',
      categoryId: fragranceCategory.id,
      products: {
        connect: [{ id: product9.id }],
      },
    },
  })
  collections.push(perfumesCollection)

  console.log('Created collections and connected products')

  // Create sample coupons
  const coupons = await Promise.all([
    prisma.coupon.create({
      data: {
        code: 'WELCOME10',
        discount: 10.00,
        type: 'PERCENTAGE',
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2025-12-31'),
        maxUses: 100,
        usedCount: 0,
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'SAVE20',
        discount: 20.00,
        type: 'FIXED',
        validFrom: new Date('2025-06-01'),
        validUntil: new Date('2025-06-30'),
        maxUses: 50,
        usedCount: 0,
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'FREESHIP',
        discount: 5.00,
        type: 'FIXED',
        validFrom: new Date('2025-03-01'),
        validUntil: null,
        maxUses: null,
        usedCount: 0,
      },
    }),
  ])

  console.log('Created sample coupons')

  console.log('Database seed completed successfully!')
  console.log(`Created:`)
  console.log(`- ${categories.length} categories`)
  console.log(`- ${products.length} products`)
  console.log(`- ${collections.length} collections`)
  console.log(`- ${coupons.length} coupons`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })