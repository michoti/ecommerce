// components/checkout/ShippingAddressForm.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

interface Address {
  firstName?: string;
  lastName?: string;
  company?: string;
  address?: string;
  apartment?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
}

interface ShippingAddressFormProps {
  shippingAddress: Address;
  billingAddress: Address;
  billingOption: 'same' | 'different';
  validationError: string | null;
  onShippingChange: (field: keyof Address, value: string) => void;
  onBillingChange: (field: keyof Address, value: string) => void;
  onBillingOptionChange: (option: 'same' | 'different') => void;
  onNext: () => void;
}

export const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  shippingAddress,
  billingAddress,
  billingOption,
  validationError,
  onShippingChange,
  onBillingChange,
  onBillingOptionChange,
  onNext,
}) => {
  const getFieldError = (field: keyof Address, isBilling = false) => {
    const address = isBilling ? billingAddress : shippingAddress;
    return validationError && !address[field] ? 'border-red-500' : '';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shipping Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First name *</Label>
              <Input
                id="firstName"
                value={shippingAddress.firstName || ''}
                onChange={(e) => onShippingChange('firstName', e.target.value)}
                className={getFieldError('firstName')}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last name *</Label>
              <Input
                id="lastName"
                value={shippingAddress.lastName || ''}
                onChange={(e) => onShippingChange('lastName', e.target.value)}
                className={getFieldError('lastName')}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="company">Company (optional)</Label>
            <Input
              id="company"
              value={shippingAddress.company || ''}
              onChange={(e) => onShippingChange('company', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={shippingAddress.address || ''}
              onChange={(e) => onShippingChange('address', e.target.value)}
              className={getFieldError('address')}
            />
          </div>
          
          <div>
            <Label htmlFor="apartment">Apartment (optional)</Label>
            <Input
              id="apartment"
              value={shippingAddress.apartment || ''}
              onChange={(e) => onShippingChange('apartment', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={shippingAddress.city || ''}
                onChange={(e) => onShippingChange('city', e.target.value)}
                className={getFieldError('city')}
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP code *</Label>
              <Input
                id="zipCode"
                value={shippingAddress.zipCode || ''}
                onChange={(e) => onShippingChange('zipCode', e.target.value)}
                className={getFieldError('zipCode')}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="country">Country *</Label>
            {/* <Select
              value={shippingAddress.country || 'US'}
              onValueChange={(value) => onShippingChange('country', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
          
          <div>
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              value={shippingAddress.phone || ''}
              onChange={(e) => onShippingChange('phone', e.target.value)}
            />
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <Label>Billing Address</Label>
            <RadioGroup
              value={billingOption}
              onValueChange={onBillingOptionChange}
              className="space-y-3 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="same" id="same" />
                <Label htmlFor="same">Same as shipping address</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="different" id="different" />
                <Label htmlFor="different">Enter a new address</Label>
              </div>
            </RadioGroup>
          </div>
          
          <AnimatePresence>
            {billingOption === 'different' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 pt-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billingFirstName">First name *</Label>
                    <Input
                      id="billingFirstName"
                      value={billingAddress.firstName || ''}
                      onChange={(e) => onBillingChange('firstName', e.target.value)}
                      className={getFieldError('firstName', true)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingLastName">Last name *</Label>
                    <Input
                      id="billingLastName"
                      value={billingAddress.lastName || ''}
                      onChange={(e) => onBillingChange('lastName', e.target.value)}
                      className={getFieldError('lastName', true)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="billingAddress">Address *</Label>
                  <Input
                    id="billingAddress"
                    value={billingAddress.address || ''}
                    onChange={(e) => onBillingChange('address', e.target.value)}
                    className={getFieldError('address', true)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billingCity">City *</Label>
                    <Input
                      id="billingCity"
                      value={billingAddress.city || ''}
                      onChange={(e) => onBillingChange('city', e.target.value)}
                      className={getFieldError('city', true)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingZipCode">ZIP code *</Label>
                    <Input
                      id="billingZipCode"
                      value={billingAddress.zipCode || ''}
                      onChange={(e) => onBillingChange('zipCode', e.target.value)}
                      className={getFieldError('zipCode', true)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="billingPhone">Phone *</Label>
                  <Input
                    id="billingPhone"
                    value={billingAddress.phone || ''}
                    onChange={(e) => onBillingChange('phone', e.target.value)}
                    className={getFieldError('phone', true)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button onClick={onNext} className="w-full mt-4">
            Continue to Shipping
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};