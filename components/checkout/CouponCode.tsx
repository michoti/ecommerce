// components/checkout/CouponCode.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Coupon {
  code: string;
  discount: number;
}

interface CouponCodeProps {
  couponCode: string;
  appliedCoupon?: Coupon;
  showInput: boolean;
  loading?: boolean;
  error?: string;
  onCodeChange: (code: string) => void;
  onApply: () => void;
  onToggleInput: () => void;
  onRemove: () => void;
}

export const CouponCode: React.FC<CouponCodeProps> = ({
  couponCode,
  appliedCoupon,
  showInput,
  loading = false,
  error,
  onCodeChange,
  onApply,
  onToggleInput,
  onRemove,
}) => {
  if (!showInput && !appliedCoupon) {
    return (
      <Button
        variant="ghost"
        onClick={onToggleInput}
        className="text-blue-600 hover:text-blue-700"
      >
        + Add coupon code
      </Button>
    );
  }

  return (
    <div>
      {showInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex space-x-2"
        >
          <Input
            placeholder="Coupon code"
            value={couponCode}
            onChange={(e) => onCodeChange(e.target.value.trim())}
            disabled={loading}
          />
          <Button onClick={onApply} size="sm" disabled={loading}>
            Apply
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {appliedCoupon && (
        <Badge variant="secondary" className="mt-2 text-green-600">
          {appliedCoupon.code} applied ({appliedCoupon.discount}% off)
        </Badge>
      )}
    </div>
  );
};