// components/checkout/ShippingMethodForm.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export type ShippingMethod = 'STANDARD' | 'EXPRESS';

interface ShippingOption {
  id: ShippingMethod;
  name: string;
  price: number;
  time: string;
}

interface ShippingMethodFormProps {
  selectedMethod: ShippingMethod;
  onMethodChange: (method: ShippingMethod) => void;
  onNext: () => void;
  onBack: () => void;
}

const shippingOptions: ShippingOption[] = [
  { id: 'STANDARD', name: 'Standard Shipping', price: 10.00, time: '5-7 business days' },
  { id: 'EXPRESS', name: 'Express Shipping', price: 25.00, time: '2-3 business days' },
];

export const ShippingMethodForm: React.FC<ShippingMethodFormProps> = ({
  selectedMethod,
  onMethodChange,
  onNext,
  onBack,
}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shipping Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={selectedMethod}
            onValueChange={(value) => onMethodChange(value as ShippingMethod)}
            className="space-y-3"
          >
            {shippingOptions.map((option) => (
              <div key={option.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex flex-col">
                    <span>{option.name}</span>
                    <span className="text-sm text-gray-600">{option.time}</span>
                  </Label>
                </div>
                <span className="font-medium">${option.price.toFixed(2)}</span>
              </div>
            ))}
          </RadioGroup>
          
          <Button onClick={onNext} className="w-full mt-4">
            Continue to Payment
          </Button>
          <Button variant="ghost" onClick={onBack} className="w-full mt-2">
            Back to Information
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};