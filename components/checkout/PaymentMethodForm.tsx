// components/checkout/PaymentMethodForm.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export type PaymentMethod = 'CREDIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER';

interface PaymentOption {
  id: PaymentMethod;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface PaymentMethodFormProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  onBack: () => void;
}

const paymentOptions: PaymentOption[] = [
  { id: 'CREDIT_CARD', name: 'Credit/Debit Card', icon: CreditCard },
  { id: 'PAYPAL', name: 'PayPal', icon: Package },
  { id: 'BANK_TRANSFER', name: 'Bank Transfer', icon: Package },
];

export const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  selectedMethod,
  onMethodChange,
  onBack,
}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={selectedMethod}
            onValueChange={(value) => onMethodChange(value as PaymentMethod)}
            className="space-y-3"
          >
            {paymentOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex items-center space-x-2">
                  <option.icon className="w-5 h-5" />
                  <span>{option.name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <Button variant="ghost" onClick={onBack} className="w-full mt-2">
            Back to Shipping
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};