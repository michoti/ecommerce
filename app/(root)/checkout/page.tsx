'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useCheckoutStore } from '@/lib/checkout/useCheckoutStore';
import { useCheckout } from '@/lib/checkout/checkout.service';
import { useCouponQuery } from '@/lib/checkout/order.service';
import { useMemo, useState } from 'react';
import { ShippingAddressForm } from '@/components/checkout/ShippingAddressForm';
import { ShippingMethodForm } from '@/components/checkout/ShippingMethodForm';
import { PaymentMethodForm } from '@/components/checkout/PaymentMethodForm';
import { CheckoutProgress } from '@/components/checkout/CheckoutProgress';
import { OrderSummary } from '@/components/checkout/OrderSummary';

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

interface UseCheckoutValidationProps {
  currentStep: number;
  shippingAddress: Address;
  billingAddress: Address;
  billingOption: 'same' | 'different';
  agreeToTerms: boolean;
}

export const useCheckoutValidation = ({
  currentStep,
  shippingAddress,
  billingAddress,
  billingOption,
  agreeToTerms,
}: UseCheckoutValidationProps) => {
  const validationError = useMemo(() => {
    const requiredShippingFields = ['firstName', 'lastName', 'address', 'city', 'zipCode'];
    const requiredBillingFields = ['firstName', 'lastName', 'address', 'city', 'zipCode', 'phone'];

    // Step 1 validation
    if (currentStep >= 1) {
      for (const field of requiredShippingFields) {
        if (!shippingAddress[field as keyof Address]) {
          return `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
        }
      }

      if (billingOption === 'different') {
        for (const field of requiredBillingFields) {
          if (!billingAddress[field as keyof Address]) {
            return `Billing ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
          }
        }
      }
    }

    // Step 3 validation
    if (currentStep === 3 && !agreeToTerms) {
      return 'You must agree to the terms and conditions';
    }

    return null;
  }, [currentStep, shippingAddress, billingAddress, billingOption, agreeToTerms]);

  const isStepValid = useMemo(() => {
    return !validationError;
  }, [validationError]);

  return { validationError, isStepValid };
};

// Main CheckoutPage component
const CheckoutPage = () => {
  // const { userId } = useAuth();
  // const router = useRouter();
  const { 
    checkout, 
    setShippingAddress, 
    setBillingAddress, 
    setShippingMethod, 
    setPaymentMethod,
    setOrderItems, 
    setCouponCode 
  } = useCheckoutStore();
  
  const { checkoutMutation, isLoading, error } = useCheckout();
  const [currentStep, setCurrentStep] = useState(1);
  const [billingOption, setBillingOption] = useState<'same' | 'different'>('same');
  const [couponCodeInput, setCouponCodeInput] = useState(checkout.couponCode || '');
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const { data: coupon, error: couponError, isLoading: couponLoading } = useCouponQuery(couponCodeInput);

  const { validationError, isStepValid } = useCheckoutValidation({
    currentStep,
    shippingAddress: checkout.shippingAddress,
    billingAddress: checkout.billingAddress,
    billingOption,
    agreeToTerms,
  });

  // Redirect if not signed in or no items
  // if (!userId) {
  //   router.push('/sign-in');
  //   return null;
  // }
  // if (!checkout.orderItems.length) {
  //   router.push('/cart');
  //   return null;
  // }

  // Calculate totals
  const calculations = useMemo(() => {
    const subtotal = checkout.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = checkout.shippingMethod === 'STANDARD' ? 10.00 : 25.00;
    const discount = coupon ? subtotal * (coupon.discount / 100) : 0;
    const total = subtotal + shippingCost - discount;
    
    return { subtotal, shippingCost, discount, total };
  }, [checkout.orderItems, checkout.shippingMethod, coupon]);

  // Event handlers
  const handleShippingAddressChange = (field: string, value: string) => {
    setShippingAddress({ [field]: value });
  };

  const handleBillingAddressChange = (field: string, value: string) => {
    setBillingAddress({ [field]: value });
  };

  const handleNextStep = () => {
    if (!isStepValid) {
      toast.error(validationError || 'Please complete all required fields');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newItems = [...checkout.orderItems];
    newItems[index] = { ...newItems[index], quantity: newQuantity };
    setOrderItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = checkout.orderItems.filter((_, i) => i !== index);
    setOrderItems(newItems);
  };

  const handleApplyCoupon = () => {
    if (!couponCodeInput.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    if (couponError) {
      toast.error('Invalid coupon code');
      return;
    }
    if (coupon) {
      setCouponCode(couponCodeInput);
      setShowCouponInput(false);
      toast.success(`Coupon ${coupon.code} applied (${coupon.discount}% off)`);
    }
  };

  const handleRemoveCoupon = () => {
    setShowCouponInput(false);
    setCouponCodeInput('');
    setCouponCode(undefined);
  };

  const handlePlaceOrder = () => {
    if (!isStepValid) {
      toast.error(validationError || 'Please complete all required fields');
      return;
    }
    checkoutMutation.mutate();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ShippingAddressForm
            shippingAddress={checkout.shippingAddress}
            billingAddress={checkout.billingAddress}
            billingOption={billingOption}
            validationError={validationError}
            onShippingChange={handleShippingAddressChange}
            onBillingChange={handleBillingAddressChange}
            onBillingOptionChange={setBillingOption}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <ShippingMethodForm
            selectedMethod={checkout.shippingMethod}
            onMethodChange={setShippingMethod}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        );
      case 3:
        return (
          <PaymentMethodForm
            selectedMethod={checkout.paymentMethod}
            onMethodChange={setPaymentMethod}
            onBack={handlePrevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CheckoutProgress currentStep={currentStep} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {renderCurrentStep()}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <OrderSummary
              items={checkout.orderItems}
              subtotal={calculations.subtotal}
              shippingCost={calculations.shippingCost}
              discount={calculations.discount}
              total={calculations.total}
              currentStep={currentStep}
              couponCode={couponCodeInput}
              appliedCoupon={coupon}
              showCouponInput={showCouponInput}
              couponLoading={couponLoading}
              couponError={couponError?.message}
              agreeToTerms={agreeToTerms}
              isLoading={isLoading?.overall}
              // error={error?.overall?.message}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
              onCouponChange={setCouponCodeInput}
              onApplyCoupon={handleApplyCoupon}
              onToggleCouponInput={() => setShowCouponInput(!showCouponInput)}
              onRemoveCoupon={handleRemoveCoupon}
              onAgreeToTermsChange={setAgreeToTerms}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;