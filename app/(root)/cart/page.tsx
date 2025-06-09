'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation } from '@/lib/modules/cart/cart.queries';
import { calculateCartTotal, getCartItemCount } from '@/lib/modules/cart/cart.utils';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import Image from 'next/image';
import { useCartMerge } from '@/lib/modules/cart/useCartMerge';
import { useCartStore } from '@/lib/modules/cart/cart.store';
import { Separator } from '@/components/ui/separator';
import { Variant } from '@/lib/modules/cart/cart.types';

const CartPage = () => {
  // const { userId } = useAuth();
  const userId = null;
  useCartMerge();
  const { data: serverCart } = useCartQuery();
  const cartState = useCartStore((state) => state.cart);
  const cart = userId ? serverCart : cartState;
  const updateItemMutation = useUpdateCartItemMutation();
  const removeItemMutation = useRemoveCartItemMutation();
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const subtotal = calculateCartTotal(cart);
  const shipping = 'TBD';
  const salesTax = 'TBD';
  const estimatedTotal = subtotal;

  const updateQuantity = async (cartItemId: string, variantId: string, newQuantity: number) => {
    console.log("this is my variantId", variantId)
    if (newQuantity < 1) return;
    try {
      const response = await fetch(`/api/variant/${variantId}`);
      if (!response.ok) throw new Error('Failed to fetch variant');
       const variant: Variant = await response.json();
      if (!variant) throw new Error('Variant not found');
      if (newQuantity > variant.stock) {
        toast.error(`Insufficient stock: ${newQuantity} requested, ${variant.stock} available`);
        return;
      }

      if (userId) {
        await updateItemMutation.mutateAsync({ cartItemId, qty: newQuantity });
      } else {
        await useCartStore.getState().updateItemQuantity(cartItemId, newQuantity);
      }
      toast.success('Quantity updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update quantity');
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      if (userId) {
        await removeItemMutation.mutateAsync(cartItemId);
      } else {
        await useCartStore.getState().removeItem(cartItemId);
      }
      toast.success('Item removed');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove item');
    }
  };

  const applyPromoCode = () => {
    if (promoCode.trim()) {
      setIsPromoApplied(true);
      toast.success('Promo code applied!');
    }
  };

  const handleCheckout = () => {
    if (!userId) {
      toast.error('Please sign in to proceed to checkout');
      window.location.href = '/sign-in';
      return;
    }
    toast.info('Proceeding to checkout...');
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                My Shopping Cart ({getCartItemCount(cart)})
              </h1>
              <div className="hidden md:grid grid-cols-12 gap-4 mb-6 pb-4 border-b border-gray-200">
                <div className="col-span-6 text-sm font-medium text-gray-600 uppercase">Product</div>
                <div className="col-span-2 text-sm font-medium text-gray-600 uppercase text-right">Price</div>
                <div className="col-span-2 text-sm font-medium text-gray-600 uppercase text-center">Quantity</div>
                <div className="col-span-2 text-sm font-medium text-gray-600 uppercase text-right">Total</div>
              </div>
              <AnimatePresence>
                {cart?.items?.length ? (
                  cart.items.map((item) => (
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
                                      onClick={() => removeItem(item.id)}
                                      className="text-sm text-gray-600 hover:text-red-500 p-0 h-auto"
                                    >
                                      <Trash2 className="w-4 h-4 mr-1" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="md:col-span-2 text-right">
                              <p className="text-lg font-medium text-gray-900">${item.variant.price}</p>
                            </div>
                            <div className="md:col-span-2 flex justify-center">
                              <div className="flex items-center border border-gray-200 rounded-md">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="p-2"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="px-4 py-2 border-x border-gray-200 min-w-[60px] text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                                  disabled={item.quantity >= item.variant.stock}
                                  className="p-2"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="md:col-span-2 text-right">
                              <p className="text-lg font-medium text-gray-900">${(item.variant.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Separator className="mb-6" />
                    </motion.div>
                  ))
                ) : (
                  <motion.div initial="hidden" animate="visible" variants={itemVariants}>
                    <p className="text-gray-600 text-center py-8">Your cart is empty.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-28"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h2>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">Do you have a promo code?</p>
                <div className="flex">
                  <Input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 border-gray-200 focus:ring-2 focus:ring-yellow-400"
                    placeholder="Enter code"
                  />
                  <Button
                    onClick={applyPromoCode}
                    className="ml-2 bg-yellow-400 hover:bg-yellow-500 text-black px-6"
                  >
                    Apply
                  </Button>
                </div>
                {isPromoApplied && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    <Badge variant="secondary" className="text-green-600">
                      Promo code applied!
                    </Badge>
                  </motion.div>
                )}
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">{shipping}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Sales Tax</span>
                  <span className="font-medium text-gray-900">{salesTax}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-gray-900">Estimated Total</span>
                  <span className="font-bold text-gray-900">${estimatedTotal.toFixed(2)}</span>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-4 text-sm font-medium"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={!cart?.items?.length}
                >
                  {userId ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                </Button>
              </motion.div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Need help? Call us at 1-800-STAR-COS
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;