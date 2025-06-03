'use client';

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
}

export default function ProductSection({ title, description, products, type }: ProductSectionProps) {
  const isProducts = type === 'products';
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const wishlistItems = useWishlistStore((state) => state.items);

  const handleWishlistToggle = (product: Product) => {
    const variant = product.variants[0]; // Use first variant for wishlist
    if (!variant) {
      toast.error('No variant available');
      return;
    }
    const isWishlisted = wishlistItems.some((item) => item.variantId === variant.id);
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
    <section className="min-h-screen bg-white py-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-light mb-4 text-[#4d0000]">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isProducts &&
            (products as Product[]).map((product, index) => {
              const isWishlisted = wishlistItems.some(
                (item) => item.variantId === product.variants[0]?.id,
              );
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gray-100">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">
                        {product.finish || product.coverage || 'Product'}
                      </p>
                      <h3 className="font-medium text-[#4d0000]">{product.name}</h3>
                      <p className="text-[#990000]">
                        ${Math.min(...product.variants.map((v) => v.price)).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleWishlistToggle(product)}
                    aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart
                      className={`h-5 w-5 ${isWishlisted ? 'fill-[#ff4d4d] text-[#ff4d4d]' : 'text-gray-600'}`}
                    />
                  </Button>
                </motion.div>
              );
            })}
          {!isProducts &&
            (products as Category[]).map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/products?category=${category.id}`} className="block">
                  <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gray-100">
                    <Image
                      src={category.collections[0]?.products[0]?.images[0] || '/api/placeholder/400/400'}
                      alt={category.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-[#4d0000]">{category.name}</h3>
                    <p className="text-xs text-gray-600">
                      {category.collections.length} Collections
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={isProducts ? '/products' : '/products'}
            className="inline-flex items-center gap-2 text-[#4d0000] hover:text-[#ff4d4d] font-medium"
          >
            View All {isProducts ? 'Products' : 'Categories'} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}