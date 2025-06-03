'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useAddToCartMutation } from '@/lib/modules/cart/cart.queries';
import { toast } from 'sonner';
import Image from 'next/image';
import { useCartMerge } from '@/lib/modules/cart/useCartMerge';
import { useWishlistStore } from '@/lib/modules/wishlist/wishlist.store';

const WishlistPage = () => {
  useCartMerge();
  const wishlistItems = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const addToCartMutation = useAddToCartMutation();

  const addToCart = async (variantId: string) => {
    try {
      await addToCartMutation.mutateAsync({ variantId, quantity: 1 });
      await removeItem(variantId);
      toast.success('Item added to cart and removed from wishlist');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add to cart');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-8">
            My Wishlist ({wishlistItems.length} items)
          </h1>
          <div className="hidden md:grid grid-cols-12 gap-4 mb-6 pb-4 border-b border-gray-200">
            <div className="col-span-6 text-sm font-medium text-gray-600 uppercase">Product</div>
            <div className="col-span-3 text-sm font-medium text-gray-600 uppercase text-right">Price</div>
            <div className="col-span-3 text-sm font-medium text-gray-600 uppercase text-right">Actions</div>
          </div>
          <AnimatePresence>
            {wishlistItems.length ? (
              wishlistItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants} exit="exit" layout>
                  <Card className="mb-6 border-0 shadow-sm rounded-lg">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-6">
                          <div className="flex space-x-4">
                            <Image
                              src={item.variant.product.images[0]}
                              alt={item.variant.product.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-contain rounded-md bg-gray-100"
                            />
                            <div className="flex-1 space-y-2">
                              <h3 className="font-medium text-gray-900">{item.variant.product.name}</h3>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>SHADE: {item.variant.shade || 'N/A'}</p>
                                <p>SKU: {item.variant.sku}</p>
                              </div>
                              <div className="flex space-x-4 pt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.variantId)}
                                  className="text-sm text-gray-600 hover:text-red-500 p-0 h-auto"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="md:col-span-3 text-right">
                          <p className="text-lg font-medium text-gray-900">${item.variant.price.toFixed(2)}</p>
                        </div>
                        <div className="md:col-span-3 text-right">
                          <Button
                            onClick={() => addToCart(item.variantId)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black"
                            disabled={addToCartMutation.isPending}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Separator className="mb-6" />
                </motion.div>
              ))
            ) : (
              <motion.div initial="hidden" animate="visible" variants={itemVariants}>
                <p className="text-gray-600 text-center py-8">Your wishlist is empty.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default WishlistPage;