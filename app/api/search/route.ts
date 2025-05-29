import { NextResponse } from 'next/server';
import { productData } from '@/lib/data';

// GET /api/search?q=query
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  // Filter products based on query matching name, shortDescription, or longDescription
  const filteredProducts = Object.values(productData.products).filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.shortDescription.toLowerCase().includes(query) ||
      product.longDescription.toLowerCase().includes(query)
  );

  // Return only relevant fields to reduce payload size
  const results = filteredProducts.map((product) => ({
    id: product.id,
    name: product.name,
    image: product.image,
    shortDescription: product.shortDescription,
    finish: product.finish || undefined,
    coverage: product.coverage || undefined,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      shade: variant.shade || undefined,
      size: variant.size || undefined,
      price: variant.price,
      sku: variant.sku,
      stock: variant.stock,
    })),
    avgRating: product.avgRating,
  }));

  return NextResponse.json({
    results,
    count: results.length,
    lastUpdated: productData.lastUpdated,
  });
}