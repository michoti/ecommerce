// components/checkout/CheckoutProgress.tsx
'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Step {
  id: number;
  name: string;
  completed: boolean;
  current: boolean;
}

interface CheckoutProgressProps {
  currentStep: number;
}

export const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ currentStep }) => {
  const steps: Step[] = [
    { id: 1, name: 'Information', completed: currentStep > 1, current: currentStep === 1 },
    { id: 2, name: 'Shipping', completed: currentStep > 2, current: currentStep === 2 },
    { id: 3, name: 'Payment', completed: false, current: currentStep === 3 },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.completed ? 'bg-green-600 text-white' : 
                step.current ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step.completed ? <CheckCircle2 className="w-5 h-5" /> : step.id}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step.current ? 'text-orange-600' : 'text-gray-500'
              }`}>{step.name}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${step.completed ? 'bg-green-600' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* <Progress value={(currentStep / 3) * 100} className="h-2" /> */}
    </div>
  );
};