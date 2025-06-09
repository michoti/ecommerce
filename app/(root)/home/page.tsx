'use client';

import { useQuery } from '@tanstack/react-query';
import { useAddToCartMutation } from '@/lib/modules/cart/cart.queries';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Product, Category, SearchResponse } from '@/lib/modules/cart/cart.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import ProductSection from '@/components/ProductSection';

const fetchFeaturedProducts = async (): Promise<Product[]> => {
  const response = await fetch('/api/search?q=featured');
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch featured products');
  }
  const { results }: SearchResponse = await response.json();
  return results;
};

const fetchBestSellers = async (): Promise<Product[]> => {
  const response = await fetch('/api/search?q=best-sellers');
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch best sellers');
  }
  const { results }: SearchResponse = await response.json();
  return results;
};

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/search?limit=1000');
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch categories');
  }
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
        cat.collections.push({ id: collection.id, name: collection.name });
      }
    });
  });
  return Array.from(categories.values());
};

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  const { data: featuredProducts, isLoading: featuredLoading, error: featuredError } = useQuery({
    queryKey: ['featured-products'],
    queryFn: fetchFeaturedProducts,
    staleTime: 5 * 60 * 1000,
  });

  const { data: bestSellers, isLoading: bestSellersLoading, error: bestSellersError } = useQuery({
    queryKey: ['best-sellers'],
    queryFn: fetchBestSellers,
    staleTime: 5 * 60 * 1000,
  });

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: addToCart } = useAddToCartMutation();

  const handleSubscribe = async () => {
    setSubmitting(true);
    setSubscribeError(null);
    setSubscribeSuccess(false);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to subscribe');
      }
      setEmail('');
      setSubscribeSuccess(true);
      toast.success('Subscribed successfully!');
    } catch (error: any) {
      setSubscribeError(error.message || 'Failed to subscribe');
      toast.error(error.message || 'Failed to subscribe');
    } finally {
      setSubmitting(false);
    }
  };

  if (featuredLoading || bestSellersLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <HeroSection />
      {featuredError ? (
        <div className="text-center text-red-600 py-8">Failed to load featured products</div>
      ) : (
        <ProductSection
          title="Featured Products"
          description="Explore our handpicked selection of bestselling products loved by makeup artists and beauty enthusiasts worldwide"
          products={featuredProducts || []}
          type="products"
        />
      )}
      {bestSellersError ? (
        <div className="text-center text-red-600 py-8">Failed to load best sellers</div>
      ) : (
        <ProductSection
          title="Best Sellers"
          description="Our most-loved products with thousands of 5-star reviews"
          products={bestSellers || []}
          type="products"
        />
      )}
      {categoriesError ? (
        <div className="text-center text-red-600 py-8">Failed to load categories</div>
      ) : (
        <ProductSection
          title="Shop by Category"
          description="Find your perfect match in our curated collections"
          products={categories || []}
          type="categories"
        />
      )}

      <section className="min-h-screen bg-white py-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="text-3xl font-light mb-4 text-gray-900">Shop Our Instagram</h2>
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
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Link href="/shop" className="p-2 bg-yellow-400 rounded-full" aria-label="Shop this post">
                    <ArrowRight size={16} className="text-black" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="https://instagram.com/starcasmetics"
              className="inline-flex items-center gap-2 text-gray-900 hover:text-yellow-500 font-medium"
              rel="noopener noreferrer"
              target="_blank"
            >
              Follow Us @StarCosmetics <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center"
          >
            <h2 className="text-3xl font-light mb-4 text-gray-900">Special Offer</h2>
            <p className="text-gray-700 mb-6">
              Subscribe to our newsletter for exclusive offers, early access to new products, and beauty tips
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 text-black rounded-md bg-gray-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                aria-label="Email address"
                disabled={submitting}
              />
              <Button
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-600 text-black rounded-md whitespace-nowrap"
                onClick={handleSubscribe}
                disabled={submitting || !email.trim()}
                aria-label="Subscribe"
              >
                {submitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
            {subscribeError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 text-sm mt-2"
              >
                {subscribeError}
              </motion.p>
            )}
            {subscribeSuccess && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-600 text-sm mt-2"
              >
                Thank you for subscribing!
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}