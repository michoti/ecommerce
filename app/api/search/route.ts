import { NextResponse } from 'next/server';
import { Product } from '@/lib/modules/cart/cart.types';
import db from '@/lib/prismadb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const slug = searchParams.get('slug');
  const categoryId = searchParams.get('category');
  const collectionId = searchParams.get('collection');
  const sort = searchParams.get('sort') || 'default';

  try {
    let where: any = {};
    let orderBy: any = {};

    if (slug) {
      where.slug = slug;
    } else {
      if (query.trim().length >= 2) {
        where.OR = [
          { name: { contains: query, mode: 'insensitive' } },
          { shortDescription: { contains: query, mode: 'insensitive' } },
        ];
      }
      if (categoryId && categoryId !== 'all') {
        where.collections = { some: { categoryId } };
        if (collectionId && collectionId !== 'all') {
          where.collections = { some: { id: collectionId } };
        }
      }
    }

    switch (sort) {
      case 'price-low-high':
        orderBy = {
          variants: { _min: { price: 'asc' } },
        };
        break;
      case 'price-high-low':
        orderBy = {
          variants: { _min: { price: 'desc' } },
        };
        break;
      case 'rating-high-low':
        orderBy = { avgRating: 'desc' };
        break;
      default:
        break;
    }

    const products = await db.product.findMany({
      where,
      include: {
        variants: true,
        reviews: true,
        collections: { include: { category: true } },
      },
      orderBy,
      take: slug ? 1 : 10,
    });

    const results: Product[] = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      finish: product.finish,
      coverage: product.coverage,
      avgRating: product.avgRating,
      images: product.images,
      variants: product.variants.map((variant) => ({
        id: variant.id,
        productId: variant.productId,
        shade: variant.shade,
        size: variant.size,
        price: variant.price,
        sku: variant.sku,
        stock: variant.stock,
        product: {
          name: product.name,
          slug: product.slug,
          images: product.images,
        },
      })),
      reviews: product.reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        reviewer: review.reviewer,
        date: review.date.toISOString(),
      })),
      collections: product.collections.map((collection) => ({
        id: collection.id,
        name: collection.name,
        category: { id: collection.category.id, name: collection.category.name },
      })),
    }));

    return NextResponse.json({
      results,
      count: results.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}