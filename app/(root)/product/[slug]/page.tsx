'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, GitCompare, Star, Plus, Minus, ShoppingCart, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { productData } from '@/lib/data';
import { useParams } from 'next/navigation';
import { useAddToCartMutation, useCartQuery } from '@/lib/modules/cart/cart.queries';
import { useCartStore } from '@/lib/modules/cart/cart.store';
import { getCartItemCount, calculateCartTotal } from '@/lib/modules/cart/cart.utils';
import { useCartMerge } from '@/lib/modules/cart/useCartMerge';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

const findProductBySlug = (slug: string) => {
  return Object.values(productData.products).find((product) => product.slug === slug);
};

export default function ProductPage() {
  const { slug } = useParams() as { slug: string };
  const product = findProductBySlug(slug);
  if (!product) {
    return <div className="text-center py-8">Product not found</div>;
  }

  const addToCartMutation = useAddToCartMutation();
  const { data: cart } = useCartQuery();
  const cartState = useCartStore((state) => state.cart);
  useCartMerge();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedShade, setSelectedShade] = useState<string>('');
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (product.variants.length > 0 && !selectedShade) {
      setSelectedShade(product.variants[0].shade || '');
    }
  }, [product]);

  const selectedVariant = product.variants.find((variant) => variant.shade === selectedShade);
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  const category = Object.values(productData.categories).find((cat) =>
    Object.values(cat.collections).some((col) => col.productIds.includes(product.id))
  );
  const collection = category
    ? Object.values(category.collections).find((col) => col.productIds.includes(product.id))
    : null;

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: category?.name || 'Category', href: `/category/${category?.id || ''}` },
    {
      name: collection?.name || 'Collection',
      href: `/category/${category?.id}/${collection?.name.toLowerCase().replace(/\s+/g, '-') || ''}`,
    },
    { name: product.name, href: `/product/${product.slug}`, current: true },
  ];

  const features = [
    product.finish ? `Finish: ${product.finish}` : product.coverage ? `Coverage: ${product.coverage}` : 'Versatile formula',
    'Highly pigmented formula',
    'Long-lasting wear',
    'Infused with moisturizing ingredients',
  ];

  const nextImage = () => setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error('Please select a shade');
      return;
    }
    if (quantity > selectedVariant.stock) {
      toast.error('Insufficient stock');
      return;
    }

    try {
      await addToCartMutation.mutateAsync({ variantId: selectedVariant.id, quantity });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add to cart');
    }
  };

  return (
    <>
      <div className="bg-white pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((item, index) => (
                <li key={item.name}>
                  <div className="flex items-center">
                    {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}
                    {item.current ? (
                      <span className="text-gray-500 font-medium">{item.name}</span>
                    ) : (
                      <Link href={item.href} className="text-blue-600 hover:text-blue-800 font-medium">
                        {item.name}
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
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
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
                <div className="absolute top-4 right-4 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Search className="h-5 w-5 text-gray-600" />
                </div>
              </motion.div>
            </Card>
            <div className="flex space-x-3">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 henior rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-blue-600' : 'border-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
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
            initial={{ opacity: 0, x: '50' }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-sm text-blue-600 font-medium">{collection?.name ?? 'Collection'}</div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            <div className="flex items-center space-x-3">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.round(product.avgRating) ? 'fill-current' : ''}`}
                  />
                )}
              </div>
              <span className="text-sm text-gray-600">({product.reviews.length} customer reviews)</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">B</span>
                </div>
                <span className="text-sm font-medium">BeautyCo</span>
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
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex items-center space-x-2 text-sm transition-colors ${
                  isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                }`}
                aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                <span>Wishlist</span>
              </button>
              <button
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Compare"
              >
                <GitCompare className="h-5 w-5" />
                <span>Compare</span>
              </button>
            </div>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center text-sm text-gray-700"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  {feature}
                </motion.div>
              ))}
            </div>
            <p className="text-gray-600 leading-relaxed">{product.longDescription}</p>
            <div className="text-sm text-gray-600">
              <span className="font-medium">SKU:</span> {selectedVariant?.sku ?? 'N/A'}
            </div>
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-bold text-gray-900">
                {selectedVariant ? `$${selectedVariant.price.toFixed(2)}` : 'N/A'}
              </span>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900" htmlFor="shade-select">
                Shade
              </label>
              <div className="flex items-center space-x-2">
                <select
                  id="shade-select"
                  value={selectedShade}
                  onChange={(e) => setSelectedShade(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Select shade"
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.shade}>
                      {variant.shade}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setSelectedShade(product.variants[0].shade || '')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-8 rounded-md transition-colors"
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                  aria-label="Add to cart"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {addToCartMutation.isPending ? 'Adding...' : 'Add to cart'}
                </Button>
              </motion.div>
            </div>
            <div className="text-sm text-gray-600">
              Cart Items: {getCartItemCount(cart || cartState)} | Total: $
              {calculateCartTotal(cart || cartState).toFixed(2)}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          {product.reviews.length > 0 ? (
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <Card key={review.id} className="p-6 bg-white rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.round(review.rating) ? 'fill-current' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{review.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-2">— {review.reviewer}</p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet for this product.</p>
          )}
        </motion.div>
      </div>
    </>
  );
}