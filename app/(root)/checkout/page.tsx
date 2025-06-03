"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Input 
} from '@/components/ui/input';
import { 
  Label 
} from '@/components/ui/label';
import { 
  Checkbox 
} from '@/components/ui/checkbox';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Progress 
} from '@/components/ui/progress';
import { 
  Badge 
} from '@/components/ui/badge';
import { 
  Separator 
} from '@/components/ui/separator';
import { 
  Alert, 
  AlertDescription 
} from '@/components/ui/alert';
import { 
  CheckCircle2, 
  CreditCard, 
  MapPin, 
  Package, 
  Gift, 
  StickyNote, 
  Minus, 
  Plus, 
  X,
  AlertCircle,
  Lock,
  Truck
} from 'lucide-react';

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(3);
  const [billingOption, setBillingOption] = useState('same');
  const [shippingMethod, setShippingMethod] = useState('flat');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Belt',
      price: 45.83,
      quantity: 1,
      image: '/api/placeholder/80/80'
    },
    {
      id: 2,
      name: 'Beanie',
      price: 15.00,
      quantity: 1,
      image: '/api/placeholder/80/80'
    }
  ]);

  const [formData, setFormData] = useState({
    email: 'support@fluidcheckout.com',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
    billingFirstName: '',
    billingLastName: '',
    billingCompany: '',
    billingAddress: '',
    billingApartment: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'US',
    billingPhone: ''
  });

  const shippingOptions = [
    { id: 'flat', name: 'Flat Rate', price: 50.00, time: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', price: 25.00, time: '2-3 business days' },
    { id: 'overnight', name: 'Overnight', price: 75.00, time: '1 business day' }
  ];

  const paymentOptions = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'paypal', name: 'PayPal', icon: Package },
    { id: 'apple', name: 'Apple Pay', icon: Package }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const selectedShipping = shippingOptions.find(option => option.id === shippingMethod);
  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const total = subtotal + shippingCost;

  const steps = [
    { id: 1, name: 'Cart', completed: true },
    { id: 2, name: 'Information', completed: true },
    { id: 3, name: 'Shipping', completed: false, current: true },
    { id: 4, name: 'Payment', completed: false }
  ];

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!agreeToTerms) newErrors.terms = 'You must agree to the terms and conditions';

    if (billingOption === 'different') {
      if (!formData.billingFirstName.trim()) newErrors.billingFirstName = 'Billing first name is required';
      if (!formData.billingLastName.trim()) newErrors.billingLastName = 'Billing last name is required';
      if (!formData.billingAddress.trim()) newErrors.billingAddress = 'Billing address is required';
      if (!formData.billingCity.trim()) newErrors.billingCity = 'Billing city is required';
      if (!formData.billingZipCode.trim()) newErrors.billingZipCode = 'Billing ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    
    // Handle successful order placement
    alert('Order placed successfully!');
  };

  const applyCoupon = () => {
    // Simulate coupon application
    if (couponCode.toLowerCase() === 'save10') {
      alert('Coupon applied! 10% discount');
    } else {
      alert('Invalid coupon code');
    }
    setShowCouponInput(false);
    setCouponCode('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.completed 
                      ? 'bg-green-600 text-white' 
                      : step.current 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.completed ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    step.current ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    step.completed ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                  <div className="flex-1">
                    <CardTitle className="text-lg">My Contact</CardTitle>
                    <p className="text-sm text-gray-600">{formData.email}</p>
                  </div>
                  <Button variant="ghost" size="sm">Change</Button>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Shipping Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                  <div className="flex-1">
                    <CardTitle className="text-lg">Shipping Method</CardTitle>
                    <p className="text-sm text-gray-600">Flat rate (US): € 50,00</p>
                  </div>
                  <Button variant="ghost" size="sm">Change</Button>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                  <div className="flex-1">
                    <CardTitle className="text-lg">Shipping To</CardTitle>
                    <div className="text-sm text-gray-600">
                      <p>Test Company Label</p>
                      <p>Test Company</p>
                      <p>Somewhere</p>
                      <p>Tallinn, CA 15551</p>
                      <p>United States (US)</p>
                      <p>+431234567</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Change</Button>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Gift Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                  <div className="flex-1">
                    <CardTitle className="text-lg">Gift Options</CardTitle>
                    <p className="text-sm text-gray-600">None.</p>
                  </div>
                  <Button variant="ghost" size="sm">Change</Button>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Additional Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                  <div className="flex-1">
                    <CardTitle className="text-lg">Additional Notes</CardTitle>
                    <p className="text-sm text-gray-600">None.</p>
                  </div>
                  <Button variant="ghost" size="sm">Change</Button>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Billing Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Billing To</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={billingOption}
                    onValueChange={setBillingOption}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="same" id="same" />
                      <Label htmlFor="same">Same as shipping address</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="saved" id="saved" />
                      <Label htmlFor="saved">Saved addresses</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="different" id="different" />
                      <Label htmlFor="different">Enter a new address</Label>
                    </div>
                  </RadioGroup>

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
                              value={formData.billingFirstName}
                              onChange={(e) => handleInputChange('billingFirstName', e.target.value)}
                              className={errors.billingFirstName ? 'border-red-500' : ''}
                            />
                            {errors.billingFirstName && (
                              <p className="text-sm text-red-500 mt-1">{errors.billingFirstName}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="billingLastName">Last name *</Label>
                            <Input
                              id="billingLastName"
                              value={formData.billingLastName}
                              onChange={(e) => handleInputChange('billingLastName', e.target.value)}
                              className={errors.billingLastName ? 'border-red-500' : ''}
                            />
                            {errors.billingLastName && (
                              <p className="text-sm text-red-500 mt-1">{errors.billingLastName}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="billingCompany">Company (optional)</Label>
                          <Input
                            id="billingCompany"
                            value={formData.billingCompany}
                            onChange={(e) => handleInputChange('billingCompany', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingAddress">Address *</Label>
                          <Input
                            id="billingAddress"
                            value={formData.billingAddress}
                            onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                            className={errors.billingAddress ? 'border-red-500' : ''}
                          />
                          {errors.billingAddress && (
                            <p className="text-sm text-red-500 mt-1">{errors.billingAddress}</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="sticky top-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                    <Button variant="ghost" size="sm">Edit cart</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        className="flex items-center space-x-4 p-3 border rounded-lg"
                      >
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">€ {item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">€ {(item.price * item.quantity).toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove item
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Separator />

                  {/* Coupon Code */}
                  <div>
                    {!showCouponInput ? (
                      <Button
                        variant="ghost"
                        onClick={() => setShowCouponInput(true)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        + Add coupon code
                      </Button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex space-x-2"
                      >
                        <Input
                          placeholder="Coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <Button onClick={applyCoupon} size="sm">
                          Apply
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowCouponInput(false);
                            setCouponCode('');
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    )}
                  </div>

                  <Separator />

                  {/* Pricing Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>€ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>€ {shippingCost.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>€ {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={setAgreeToTerms}
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
                    {errors.terms && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.terms}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Place Order Button */}
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || !agreeToTerms}
                  >
                    {isProcessing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : null}
                    {isProcessing ? 'Processing...' : 'Place order'}
                  </Button>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;