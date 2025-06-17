// components/checkout/OrderSummary.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OrderItem, OrderItemData } from './OrderItem';
import { CouponCode } from './CouponCode';

interface Coupon {
  code: string;
  discount: number;
}

interface OrderSummaryProps {
  items: OrderItemData[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  currentStep: number;
  couponCode: string;
  appliedCoupon?: Coupon;
  showCouponInput: boolean;
  couponLoading?: boolean;
  couponError?: string;
  agreeToTerms: boolean;
  isLoading?: boolean;
  error?: string;
  onQuantityChange: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCouponChange: (code: string) => void;
  onApplyCoupon: () => void;
  onToggleCouponInput: () => void;
  onRemoveCoupon: () => void;
  onAgreeToTermsChange: (agreed: boolean) => void;
  onPlaceOrder: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  shippingCost,
  discount,
  total,
  currentStep,
  couponCode,
  appliedCoupon,
  showCouponInput,
  couponLoading = false,
  couponError,
  agreeToTerms,
  isLoading = false,
  error,
  onQuantityChange,
  onRemoveItem,
  onCouponChange,
  onApplyCoupon,
  onToggleCouponInput,
  onRemoveCoupon,
  onAgreeToTermsChange,
  onPlaceOrder,
}) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="sticky top-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Order Summary</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push('/cart')}>
              Edit cart
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Cart Items */}
          <div className="space-y-4">
            {items.map((item, index) => (
              <OrderItem
                key={`${item.productId}-${item.variantId || 'default'}`}
                item={item}
                index={index}
                onQuantityChange={onQuantityChange}
                onRemove={onRemoveItem}
                disabled={isLoading}
              />
            ))}
          </div>

          <Separator />

          {/* Coupon Code */}
          <CouponCode
            couponCode={couponCode}
            appliedCoupon={appliedCoupon}
            showInput={showCouponInput}
            loading={couponLoading}
            error={couponError}
            onCodeChange={onCouponChange}
            onApply={onApplyCoupon}
            onToggleInput={onToggleCouponInput}
            onRemove={onRemoveCoupon}
          />

          <Separator />

          {/* Pricing Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-600">-${discount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          {/* Terms and Conditions */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => onAgreeToTermsChange(!!checked)}
                />
                <Label htmlFor="terms" className="text-sm leading-5">
                  I have read and agree to the website{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    terms and conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    privacy policy
                  </a>{' '}
                  *
                </Label>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
                onClick={onPlaceOrder}
                disabled={isLoading || !agreeToTerms}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : null}
                {isLoading ? 'Processing...' : 'Place order'}
              </Button>
            </div>
          )}

          {/* Security Badge */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};