'use client';

import { Suspense, memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useWishlistStore } from '@/lib/modules/wishlist/wishlist.store';
import { Category, Product } from '@/lib/modules/cart/cart.types';

interface ProductSectionProps {
  title: string;
  description: string;
  products: Product[] | Category[];
  type: 'products' | 'categories';
  isLoading: boolean;
}

// Skeleton components for different item types
const ProductCardSkeleton = memo(({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group relative"
  >
    <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gradient-to-br from-gray-200 to-gray-300">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
    </div>
    <div className="text-center space-y-2">
      <div className="h-3 bg-gray-200 rounded w-16 mx-auto animate-pulse" />
      <div className="h-5 bg-gray-200 rounded w-24 mx-auto animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse" />
    </div>
  </motion.div>
));

ProductCardSkeleton.displayName = 'ProductCardSkeleton';

const CategoryCardSkeleton = memo(({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group relative"
  >
    <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gradient-to-br from-gray-200 to-gray-300">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
    </div>
    <div className="text-center space-y-2">
      <div className="h-5 bg-gray-200 rounded w-28 mx-auto animate-pulse" />
      <div className="h-3 bg-gray-200 rounded w-20 mx-auto animate-pulse" />
    </div>
  </motion.div>
));

CategoryCardSkeleton.displayName = 'CategoryCardSkeleton';

// Individual product card component
const ProductCard = memo(({ product, index }: { product: Product; index: number }) => {
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const wishlistItems = useWishlistStore((state) => state.items);

  const isWishlisted = wishlistItems.some(
    (item) => item.variantId === product.variants[0]?.id,
  );

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const variant = product.variants[0];
    if (!variant) {
      toast.error('No variant available');
      return;
    }

    try {
      if (isWishlisted) {
        removeFromWishlist(variant.id);
        toast.success('Removed from wishlist');
      } else {
        addToWishlist({
          id: variant.id,
          variantId: variant.id,
          variant,
        });
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update wishlist');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative cursor-pointer"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gray-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={700}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">
            {product.finish || product.coverage || 'Product'}
          </p>
          <h3 className="font-medium text-[#4d0000] line-clamp-1">{product.name}</h3>
          <p className="text-[#990000] font-semibold">
            ${Math.min(...product.variants.map((v) => v.price)).toFixed(2)}
          </p>
        </div>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/80 hover:bg-white shadow-sm"
        onClick={handleWishlistToggle}
        aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            isWishlisted ? 'fill-[#ff4d4d] text-[#ff4d4d]' : 'text-gray-600 hover:text-[#ff4d4d]'
          }`}
        />
      </Button>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

// Individual category card component
const CategoryCard = memo(({ category, index }: { category: Category; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="group"
  >
    <Link href={`/shop?category=${category.id}`} className="block">
      <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gray-100">
        <Image
          src={'/api/placeholder/400/400'}
          alt={category.name}
          width={600}
          height={700}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </div>
      <div className="text-center">
        <h3 className="font-medium text-[#4d0000] line-clamp-1">{category.name}</h3>
        <p className="text-xs text-gray-600">
          {category.collections.length} Collection{category.collections.length !== 1 ? 's' : ''}
        </p>
      </div>
    </Link>
  </motion.div>
));

CategoryCard.displayName = 'CategoryCard';

// Loading fallback component
function ProductSectionSkeleton({ title, description, type }: { 
  title: string; 
  description: string; 
  type: 'products' | 'categories';
}) {
  const SkeletonCard = type === 'products' ? ProductCardSkeleton : CategoryCardSkeleton;
  
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
            <SkeletonCard key={index} index={index} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </section>
  );
}

// Main ProductSection component wrapped in Suspense
export default function ProductSection({ title, description, products, type, isLoading }: ProductSectionProps) {
  const isProducts = type === 'products';

  // Show skeleton while loading
  if (isLoading) {
    return <ProductSectionSkeleton title={title} description={description} type={type} />;
  }

  return (
    <Suspense fallback={<ProductSectionSkeleton title={title} description={description} type={type} />}>
      <section className="min-h-screen bg-white py-12 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-light mb-4 text-[#4d0000]">{title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isProducts ? (
              (products as Product[]).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            ) : (
              (products as Category[]).map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[#4d0000] hover:text-[#ff4d4d] font-medium transition-colors duration-200"
            >
              View All {isProducts ? 'Products' : 'Categories'} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </Suspense>
  );
}