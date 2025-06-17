'use client';

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
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

// API Functions
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

// Loading Fallback Components
function ProductSectionSkeleton({ title, description }: { title: string; description: string }) {
  return (
    <section className="min-h-screen bg-white py-12 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-light mb-4 text-[#4d0000]">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
              </div>
              <div className="text-center space-y-2">
                <div className="h-3 bg-gray-200 rounded w-16 mx-auto animate-pulse" />
                <div className="h-5 bg-gray-200 rounded w-24 mx-auto animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function ErrorFallback({ title, error, retry }: { title: string; error: Error; retry: () => void }) {
  return (
    <section className="min-h-screen bg-white py-12 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-light mb-4 text-[#4d0000]">{title}</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 mb-4">Failed to load {title.toLowerCase()}</p>
            <p className="text-sm text-red-500 mb-4">{error.message}</p>
            <Button 
              onClick={retry}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Suspense-wrapped Components
function FeaturedProductsSection() {
  const { data: products, error, refetch } = useQuery({
    queryKey: ['featured-products'],
    queryFn: fetchFeaturedProducts,
    staleTime: 5 * 60 * 1000,
    suspense: true,
  });

  if (error) {
    return (
      <ErrorFallback 
        title="Featured Products" 
        error={error as Error} 
        retry={() => refetch()} 
      />
    );
  }

  return (
    <ProductSection
      title="Featured Products"
      description="Explore our handpicked selection of bestselling products loved by makeup artists and beauty enthusiasts worldwide"
      products={products || []}
      type="products"
      isLoading={false}
    />
  );
}

function BestSellersSection() {
  const { data: products, error, refetch } = useQuery({
    queryKey: ['best-sellers'],
    queryFn: fetchBestSellers,
    staleTime: 5 * 60 * 1000,
    suspense: true,
  });

  if (error) {
    return (
      <ErrorFallback 
        title="Best Sellers" 
        error={error as Error} 
        retry={() => refetch()} 
      />
    );
  }

  return (
    <ProductSection
      title="Best Sellers"
      description="Our most-loved products with thousands of 5-star reviews"
      products={products || []}
      type="products"
      isLoading={false}
    />
  );
}

function CategoriesSection() {
  const { data: categories, error, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
    suspense: true,
  });

  if (error) {
    return (
      <ErrorFallback 
        title="Categories" 
        error={error as Error} 
        retry={() => refetch()} 
      />
    );
  }

  return (
    <ProductSection
      title="Shop by Category"
      description="Find your perfect match in our curated collections"
      products={categories || []}
      type="categories"
      isLoading={false}
    />
  );
}

// Newsletter Section Component
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim()) return;
    
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

  return (
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
              onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
            />
            <Button
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-600 text-black rounded-md whitespace-nowrap disabled:opacity-50"
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
  );
}

// Instagram Section Component
function InstagramSection() {
  return (
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
                <Link 
                  href="/shop" 
                  className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 transition-colors" 
                  aria-label="Shop this post"
                >
                  <ArrowRight size={16} className="text-black" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="https://instagram.com/starcasmetics"
            className="inline-flex items-center gap-2 text-gray-900 hover:text-yellow-500 font-medium transition-colors"
            rel="noopener noreferrer"
            target="_blank"
          >
            Follow Us @StarCosmetics <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="bg-white">
      <HeroSection />
      
      <Suspense fallback={
        <ProductSectionSkeleton 
          title="Featured Products" 
          description="Explore our handpicked selection of bestselling products loved by makeup artists and beauty enthusiasts worldwide" 
        />
      }>
        <FeaturedProductsSection />
      </Suspense>

      <Suspense fallback={
        <ProductSectionSkeleton 
          title="Best Sellers" 
          description="Our most-loved products with thousands of 5-star reviews" 
        />
      }>
        <BestSellersSection />
      </Suspense>

      <Suspense fallback={
        <ProductSectionSkeleton 
          title="Shop by Category" 
          description="Find your perfect match in our curated collections" 
        />
      }>
        <CategoriesSection />
      </Suspense>

      <InstagramSection />
      <NewsletterSection />
    </div>
  );
}