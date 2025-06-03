'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight, Star, ShoppingCart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAddToCartMutation } from '@/lib/modules/cart/cart.queries';
import { useCartMerge } from '@/lib/modules/cart/useCartMerge';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/modules/cart/cart.types';
import { useAuth } from '@clerk/nextjs';
import { calculateCartTotal, getCartItemCount } from '@/lib/modules/cart/cart.utils';
import { useCartStore } from '@/lib/modules/cart/cart.store';
import { useWishlistStore } from '@/lib/modules/wishlist/wishlist.store';

const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  const response = await fetch(`/api/search?slug=${encodeURIComponent(slug)}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  const { results } = await response.json();
  return results.length > 0 ? results[0] : null;
};

const ProductPage = () => {
  const { slug } = useParams() as { slug: string };
  // const { userId } = useAuth();
  const userId = null;
  const { data: product, error, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug),
  });
  const addToCartMutation = useAddToCartMutation();
  const cartState = useCartStore((state) => state.cart);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  useCartMerge();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');

  useEffect(() => {
    if (product?.variants?.length && !selectedVariantId) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product?.variants, selectedVariantId]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          Loading...
        </div>
      </div>
    );
  if (error || !product)
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          Product not found
        </div>
      </div>
    );

  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId);
  const isWishlisted = wishlistItems.some((item) => item.variantId === selectedVariantId);

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    {
      name: product.collections[0]?.category?.name || 'Category',
      href: `/shop?category=${product.collections[0]?.category?.id || ''}`,
    },
    {
      name: product.collections[0]?.name || 'Collection',
      href: `/shop?category=${product.collections[0]?.category?.id || ''}&collection=${product.collections[0]?.id || ''}`,
    },
    { name: product.name, href: `/product/${product.slug}`, current: true },
  ];

  const features = [
    product.finish ? `Finish: ${product.finish}` : null,
    product.coverage ? `Coverage: ${product.coverage}` : null,
    'Highly pigmented formula',
    'Long-lasting wear',
  ].filter(Boolean);

  const nextImage = () => setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }
    if (quantity > selectedVariant.stock) {
      toast.error(`Only ${selectedVariant.stock} items in stock`);
      return;
    }
    try {
      if (userId) {
        await addToCartMutation.mutateAsync({ variantId: selectedVariant.id, quantity });
      } else {
        useCartStore.getState().addItem(selectedVariant.id, quantity);
      }
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart');
    }
  };

  const handleWishlistToggle = async () => {
    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }
    try {
      if (isWishlisted) {
        removeFromWishlist(selectedVariant.id);
        toast.success('Removed from wishlist');
      } else {
        addToWishlist({
          id: selectedVariant.id,
          variantId: selectedVariant.id,
          variant: selectedVariant,
        });
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((item, index) => (
              <li key={item.name}>
                <div className="flex items-center">
                  {index > 0 && <ChevronRight className="h-4 w-4 text-gray-900 mx-2" />}
                  {item.current ? (
                    <span className="text-gray-900 font-medium">{item.name}</span>
                  ) : (
                    <Link href={item.href} className="text-blue-600 hover:text-blue-800 font-medium">
                      {item.name}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="relative overflow-hidden bg-white p-8 rounded-lg">
              <motion.div
                className="relative w-full h-full group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={product.images[selectedImageIndex]}
                  alt={`${product.name} view ${selectedImageIndex + 1}`}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-900" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 text-gray-900" />
                </button>
                <div className="absolute top-4 right-4 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Search className="h-5 w-5 text-gray-900" />
                </div>
              </motion.div>
            </Card>
            <div className="flex space-x-3">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-yellow-400' : 'border-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain bg-white p-2"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-sm text-blue-600 font-medium">
              {product.collections[0]?.name || 'Collections'}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            <div className="flex items-center space-x-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.round(product.avgRating) ? 'fill-current' : ''}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.reviews.length} reviews)</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span className="text-sm font-medium">Star Cosmetics</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Availability:</span>
                <span
                  className={`font-medium ml-1 ${
                    selectedVariant && selectedVariant.stock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {selectedVariant ? `${selectedVariant.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleWishlistToggle}
                className={`flex items-center space-x-2 text-sm transition-colors ${
                  isWishlisted ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                }`}
                aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                <span>{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center text-sm text-gray-600"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  {feature}
                </motion.div>
              ))}
            </div>
            <p className="text-gray-600 leading-relaxed">{product.longDescription}</p>
            <div className="text-sm text-gray-600">
              <span className="font-medium">SKU:</span> {selectedVariant?.sku || 'N/A'}
            </div>
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                {selectedVariant ? `$${selectedVariant.price.toFixed(2)}` : 'N/A'}
              </span>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900" htmlFor="variant-select">
                {selectedVariant?.shade ? 'Shade' : 'Size'}
              </label>
              <select
                id="variant-select"
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                className="border border-gray-200 rounded-md px-3 py-1.5 bg-white text-sm focus:ring-2 focus:ring-yellow-400 w-full"
                aria-label="Select variant"
              >
                {product.variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.shade || variant.size || 'Default'}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-200 rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
                  className="w-16 text-center border-0 focus:ring-0"
                  min="1"
                  max={selectedVariant ? selectedVariant.stock : 0}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setQuantity(
                      selectedVariant ? Math.min(selectedVariant.stock, quantity + 1) : quantity,
                    )
                  }
                  disabled={selectedVariant && quantity >= selectedVariant.stock}
                  className="p-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg px-6 py-3 text-sm font-medium"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || addToCartMutation.isPending}
                >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                </Button>
              </motion.div>
            </div>
            <div className="text-sm text-gray-600">
              Cart items: {getCartItemCount(cartState)} | Total: $
              {calculateCartTotal(cartState).toFixed(2)}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-12"
          initial={{ opacity: "0", y: "50" }}
          animate={{ opacity: "1", y: "0" }}
          transition={{ duration: "0.6", delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          {product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <Card key={review.id} className="p-4 bg-white rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.round(review.rating) ? 'fill-current' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{review.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-tight">{review.comment}</p>
                  <p className="text-sm text-gray-600 mt-2">— {review.reviewer}</p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet.</p>
          )}
        </motion.div>
      </div>
      </div>
    );
};

export default ProductPage;