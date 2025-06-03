'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { parseAsString, useQueryStates } from 'nuqs';
import { useMemo, useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { SearchResponse, Product, Category } from '@/lib/modules/cart/cart.types';

const fetchProducts = async (params: {
  category: string;
  collection: string;
  sort: string;
  search: string;
}): Promise<SearchResponse> => {
  const queryParams = new URLSearchParams();
  if (params.search.trim().length >= 2) queryParams.set('q', params.search);
  if (params.category !== 'all') queryParams.set('category', params.category);
  if (params.collection !== 'all') queryParams.set('collection', params.collection);
  if (params.sort !== 'default') queryParams.set('sort', params.sort);

  const response = await fetch(`/api/search?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/search');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  const { results } = await response.json();
  const categories = new Map<string, Category>();
  results.forEach((product: Product) => {
    product.collections.forEach((collection) => {
      const category = collection.category;
      if (!categories.has(category.id)) {
        categories.set(category.id, {
          id: category.id,
          name: category.name,
          collections: [],
        });
      }
      const cat = categories.get(category.id)!;
      if (!cat.collections.some((c) => c.id === collection.id)) {
        cat.collections.push({
          id: collection.id,
          name: collection.name,
          products: [product],
        });
      } else {
        cat.collections.find((c) => c.id === collection.id)!.products.push(product);
      }
    });
  });
  return Array.from(categories.values());
};

const ShopPage = () => {
  const [query, setQuery] = useQueryStates({
    category: parseAsString.withDefault('all'),
    collection: parseAsString.withDefault('all'),
    sort: parseAsString.withDefault('default'),
    search: parseAsString.withDefault(''),
  });

  const [localSearch, setLocalSearch] = useState(query.search);
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery({ search: localSearch });
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, setQuery]);

  const { data: searchData, isLoading, error } = useQuery({
    queryKey: ['products', query],
    queryFn: () => fetchProducts(query),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const products: Product[] = useMemo(() => searchData?.results || [], [searchData]);
  const categories: Category[] = useMemo(() => categoriesData || [], [categoriesData]);

  const collections = useMemo(
    () =>
      query.category === 'all'
        ? []
        : categories
            .find((cat) => cat.id === query.category)
            ?.collections.map((col) => ({ id: col.id, name: col.name })) || [],
    [categories, query.category]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse text-center text-gray-600">
            Loading products...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-600">
            Error loading products: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate="visible"
          variants={{
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <select
                value={query.category}
                onChange={(e) =>
                  setQuery({
                    category: e.target.value,
                    collection: 'all',
                  })
                }
                className="p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-yellow-400"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {collections.length > 0 && (
                <select
                  value={query.collection}
                  onChange={(e) => setQuery({ collection: e.target.value })}
                  className="p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="all">All Collections</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search products..."
                className="p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-yellow-400"
              />
              <select
                value={query.sort}
                onChange={(e) => setQuery({ sort: e.target.value })}
                className="p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-yellow-400"
              >
                <option value="default">Sort By: Default</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating-high-low">Rating: High to Low</option>
              </select>
            </div>
          </div>
        </motion.div>
        {products.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    images: product.images,
                    finish: product.finish,
                    variants: product.variants,
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;