import db from '@/lib/prismadb';
import Decimal from 'decimal.js';
import { Product, Variant } from './modules/cart/cart.types';

export const getVariantById = async (variantId: string): Promise<Variant | null> => {
  try {
    const variant = await db.variant.findUnique({
      where: { id: variantId },
      include: { product: { select: { name: true, slug: true, images: true } } },
    });
    if (!variant) return null;
    return {
      id: variant.id,
      productId: variant.productId,
      shade: variant.shade,
      size: variant.size,
      price: new Decimal(variant.price.toString()),
      sku: variant.sku,
      stock: variant.stock,
      product: {
        name: variant.product.name,
        slug: variant.product.slug,
        images: variant.product.images,
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch variant: ${error.message}`);
  }
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        variants: { include: { product: { select: { name: true, slug: true, images: true } } } },
        reviews: true,
        collections: { include: { category: { select: { id: true, name: true } } } },
      },
    });
    if (!product) return null;
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      finish: product.finish,
      coverage: product.coverage,
      avgRating: product.avgRating,
      images: product.images,
      variants: product.variants.map((v) => ({
        id: v.id,
        productId: v.productId,
        shade: v.shade,
        size: v.size,
        price: new Decimal(v.price.toString()),
        sku: v.sku,
        stock: v.stock,
        product: {
          name: v.product.name,
          slug: v.product.slug,
          images: v.product.images,
        },
      })),
      reviews: product.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        reviewer: r.reviewer,
        date: r.date.toISOString(),
      })),
      collections: product.collections.map((c) => ({
        id: c.id,
        name: c.name,
        category: { id: c.category.id, name: c.category.name },
      })),
    };
  } catch (error) {
    throw new Error(`Failed to fetch product: ${error.message}`);
  }
};