'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { parseAsString, parseAsInteger, useQueryStates } from 'nuqs';
import { useMemo, useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { SearchResponse, Product, Category } from '@/lib/modules/cart/cart.types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PRODUCTS_PER_PAGE = 6;

const fetchProducts = async (params: {
  category: string;
  collection: string;
  sort: string;
  search: string;
  page: number;
}): Promise<SearchResponse> => {
  const queryParams = new URLSearchParams();
  if (params.search.trim().length >= 2) queryParams.set('q', params.search);
  if (params.category !== 'all') queryParams.set('category', params.category);
  if (params.collection !== 'all') queryParams.set('collection', params.collection);
  if (params.sort !== 'default') queryParams.set('sort', params.sort);
  queryParams.set('page', params.page.toString());
  queryParams.set('limit', PRODUCTS_PER_PAGE.toString());

  const response = await fetch(`/api/search?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/search?limit=1000');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  const { results }: SearchResponse = await response.json();
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
        });
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
    page: parseAsInteger.withDefault(1),
  });

  const [localSearch, setLocalSearch] = useState(query.search);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery({ search: localSearch, page: 1 });
    }, 700);
    return () => clearTimeout(handler);
  }, [localSearch, setQuery]);

  const { data: searchData, isLoading, error } = useQuery({
    queryKey: ['products', query],
    queryFn: () => fetchProducts({ ...query, page: query.page }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });

  const products: Product[] = useMemo(() => searchData?.results || [], [searchData]);
  const totalPages = useMemo(() => searchData?.totalPages || 1, [searchData]);
  const currentPage = useMemo(() => searchData?.page || query.page, [searchData, query.page]);

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

  const handlePageChange = (newPage: number) => {
    setQuery({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                    page: 1,
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
                  onChange={(e) => setQuery({ collection: e.target.value, page: 1 })}
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
                onChange={(e) => setQuery({ sort: e.target.value, page: 1 })}
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
          <>
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
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-8 flex justify-center items-center gap-2 flex-wrap"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 border-gray-200 hover:bg-yellow-400 hover:text-black focus:ring-yellow-400"
                >
                  <ChevronLeft size={16} />
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                  )
                  .map((page) => (
                    <Button
                      key={`page${page}`}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={`${
                        currentPage === page
                          ? 'bg-yellow-500 text-black'
                          : 'border-gray-200 hover:bg-yellow-400 hover:text-black'
                      } focus:ring-yellow-400 min-w-[2rem]`
                    }
                    >
                        {page}
                      </Button>
                  ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 border-gray-200 hover:bg-yellow-400 hover:text-black focus:ring-yellow-400"
                >
                  Next
                  <ChevronRight size="right" />
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShopPage;