// components/checkout/OrderItem.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Package, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface OrderItemData {
  productId: string;
  variantId?: string;
  price: number;
  quantity: number;
  name?: string;
  image?: string;
}

interface OrderItemProps {
  item: OrderItemData;
  index: number;
  onQuantityChange: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
}

export const OrderItem: React.FC<OrderItemProps> = ({
  item,
  index,
  onQuantityChange,
  onRemove,
  disabled = false,
}) => {
  return (
    <motion.div
      layout
      className="flex items-center space-x-4 p-3 border rounded-lg"
    >
      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
        {item.image ? (
          <img src={item.image} alt={item.name || 'Product'} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <Package className="w-8 h-8 text-gray-400" />
        )}
      </div>
      
      <div className="flex-1">
        <h4 className="font-medium">{item.name || `Product ${item.productId}`}</h4>
        <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onQuantityChange(index, item.quantity - 1)}
          disabled={item.quantity <= 1 || disabled}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onQuantityChange(index, item.quantity + 1)}
          disabled={disabled}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="text-right">
        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-700"
          disabled={disabled}
        >
          Remove
        </Button>
      </div>
    </motion.div>
  );
};