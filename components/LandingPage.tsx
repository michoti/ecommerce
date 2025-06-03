'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HeroSection from './HeroSection';
import ProductSection from './ProductSection';
import { Product, Category, SearchResponse } from '@/lib/modules/cart/cart.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const fetchFeaturedProducts = async (): Promise<Product[]> => {
  const response = await fetch('/api/search?q=featured');
  if (!response.ok) throw new Error('Failed to fetch featured products');
  const { results }: SearchResponse = await response.json();
  return results;
};

const fetchBestSellers = async (): Promise<Product[]> => {
  const response = await fetch('/api/search?q=best-sellers');
  if (!response.ok) throw new Error('Failed to fetch best sellers');
  const { results }: SearchResponse = await response.json();
  return results;
};

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/search');
  if (!response.ok) throw new Error('Failed to fetch categories');
  const { results }: SearchResponse = await response.json();
  const categories = new Map<string, Category>();
  results.forEach((product: Product) => {
    product.collections.forEach((collection) => {
      const category = collection.category;
      if (!categories.has(category.id)) {
        categories.set(category.id, { id: category.id, name: category.name, collections: [] });
      }
      const cat = categories.get(category.id)!;
      if (!cat.collections.some((c) => c.id === collection.id)) {
        cat.collections.push({ id: collection.id, name: collection.name, products: [product] });
      } else {
        cat.collections.find((c) => c.id === collection.id)!.products.push(product);
      }
    });
  });
  return Array.from(categories.values());
};

export default function LandingPage() {
  const { data: featuredProducts, isLoading: featuredLoading, error: featuredError } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: fetchFeaturedProducts,
    staleTime: 5 * 60 * 1000,
  });

  const { data: bestSellers, isLoading: bestSellersLoading, error: bestSellersError } = useQuery({
    queryKey: ['bestSellers'],
    queryFn: fetchBestSellers,
    staleTime: 5 * 60 * 1000,
  });

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });

  if (featuredLoading || bestSellersLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          Loading...
        </div>
      </div>
    );
  }

  if (featuredError || bestSellersError || categoriesError) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          Error loading data
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <HeroSection />
      <ProductSection
        title="OUR FEATURED COLLECTION"
        description="Explore our handpicked selection of bestselling products loved by makeup artists and beauty enthusiasts worldwide"
        products={featuredProducts || []}
        type="products"
      />
      <ProductSection
        title="BEST SELLERS"
        description="Our most-loved products with thousands of 5-star reviews"
        products={bestSellers || []}
        type="products"
      />
      <ProductSection
        title="SHOP BY CATEGORY"
        description="Find your perfect match in our curated collections"
        products={categories || []}
        type="categories"
      />

      {/* Instagram Feed */}
      <section className="min-h-screen bg-white py-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-light mb-4 text-gray-900">SHOP OUR IG</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get inspired by our community and shop their favorite products
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="aspect-square overflow-hidden relative group"
              >
                <img
                  src={`/api/placeholder/200/200`}
                  alt={`Instagram post ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Link href="#" className="p-2 bg-yellow-400 rounded-full">
                    <ArrowRight size={16} className="text-black" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-gray-900 hover:text-yellow-400 font-medium"
            >
              Follow Us @StarCosmetics <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center"
          >
            <h2 className="text-3xl font-light mb-4 text-gray-900">SPECIAL FOR YOU</h2>
            <p className="text-gray-700 mb-6">
              Subscribe to our newsletter for exclusive offers, early access to new products, and beauty tips from our experts
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <Button className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-md whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}