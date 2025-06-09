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
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  try {
    let where: any = {};
    let orderBy: any = {};

    // Handle single product by slug
    if (slug) {
      where.slug = slug;
    } else {
      // Handle search query
      if (query.trim().length >= 1) {
        if (query === 'featured') {
          where.featured = true;
        } else if (query === 'best-sellers') {
          where.avgRating = { gte: 4 };
        } else {
          where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { shortDescription: { contains: query, mode: 'insensitive' } },
            { longDescription: { contains: query, mode: 'insensitive' } },
          ];
        }
      }

      // Handle category and collection filtering
      if (categoryId && categoryId !== 'all') {
        if (collectionId && collectionId !== 'all') {
          // Filter by specific collection
          where.collections = { some: { id: collectionId } };
        } else {
          // Filter by category
          where.collections = { some: { categoryId } };
        }
      }
    }

    // Handle sorting - fix the variants ordering issue
    switch (sort) {
      case 'price-low-high':
        // First, get products with their minimum variant price
        const productsWithMinPrice = await db.product.findMany({
          where,
          select: {
            id: true,
            variants: {
              select: { price: true },
              orderBy: { price: 'asc' },
              take: 1,
            },
          },
        });
        
        // Sort by minimum price and get IDs in order
        const sortedIds = productsWithMinPrice
          .sort((a, b) => {
            const aPrice = a.variants[0]?.price || 0;
            const bPrice = b.variants[0]?.price || 0;
            return Number(aPrice) - Number(bPrice);
          })
          .map(p => p.id);
        
        // Use the sorted IDs for ordering
        orderBy = sortedIds.length > 0 ? {
          id: { in: sortedIds }
        } : { createdAt: 'desc' };
        break;
        
      case 'price-high-low':
        const productsWithMaxPrice = await db.product.findMany({
          where,
          select: {
            id: true,
            variants: {
              select: { price: true },
              orderBy: { price: 'desc' },
              take: 1,
            },
          },
        });
        
        const sortedIdsDesc = productsWithMaxPrice
          .sort((a, b) => {
            const aPrice = a.variants[0]?.price || 0;
            const bPrice = b.variants[0]?.price || 0;
            return Number(bPrice) - Number(aPrice);
          })
          .map(p => p.id);
        
        orderBy = sortedIdsDesc.length > 0 ? {
          id: { in: sortedIdsDesc }
        } : { createdAt: 'desc' };
        break;
        
      case 'rating-high-low':
        orderBy = { avgRating: 'desc' };
        break;
        
      case 'name-a-z':
        orderBy = { name: 'asc' };
        break;
        
      case 'name-z-a':
        orderBy = { name: 'desc' };
        break;
        
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
        
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
        
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Get total count for pagination
    const totalCount = slug ? 1 : await db.product.count({ where });

    // Fetch products with all related data
    let products;
    
    if (sort === 'price-low-high' || sort === 'price-high-low') {
      // For price sorting, we need to handle it differently
      const allProducts = await db.product.findMany({
        where,
        include: {
          variants: {
            orderBy: { price: 'asc' }
          },
          reviews: {
            orderBy: { createdAt: 'desc' }
          },
          collections: { 
            include: { category: true } 
          },
        },
      });

      // Sort products by their minimum/maximum variant price
      const sortedProducts = allProducts.sort((a, b) => {
        const aPrice = sort === 'price-low-high' 
          ? Math.min(...a.variants.map(v => Number(v.price)))
          : Math.max(...a.variants.map(v => Number(v.price)));
        const bPrice = sort === 'price-low-high'
          ? Math.min(...b.variants.map(v => Number(v.price)))
          : Math.max(...b.variants.map(v => Number(v.price)));
        
        return sort === 'price-low-high' ? aPrice - bPrice : bPrice - aPrice;
      });

      // Apply pagination
      products = sortedProducts.slice(skip, skip + limit);
    } else {
      // For other sorting, use regular Prisma query
      products = await db.product.findMany({
        where,
        include: {
          variants: {
            orderBy: { price: 'asc' }
          },
          reviews: {
            orderBy: { createdAt: 'desc' }
          },
          collections: { 
            include: { category: true } 
          },
        },
        orderBy,
        skip: slug ? 0 : skip,
        take: slug ? 1 : limit,
      });
    }

    // Transform products to match the expected format
    const results: Product[] = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription || undefined,
      finish: product.finish || undefined,
      coverage: product.coverage || undefined,
      avgRating: product.avgRating,
      featured: product.featured,
      images: product.images,
      variants: product.variants.map((variant) => ({
        id: variant.id,
        productId: variant.productId,
        shade: variant.shade || undefined,
        size: variant.size || undefined,
        price: parseFloat(variant.price.toString()),
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
        comment: review.comment || undefined,
        reviewer: review.reviewer,
        date: review.createdAt.toISOString(),
      })),
      collections: product.collections.map((collection) => ({
        id: collection.id,
        name: collection.name,
        category: { 
          id: collection.category.id, 
          name: collection.category.name 
        },
      })),
    }));

    // Calculate pagination info
    const hasNextPage = skip + limit < totalCount;
    const hasPrevPage = page > 1;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      results,
      count: results.length,
      totalCount,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      }, 
      { status: 500 }
    );
  }
}