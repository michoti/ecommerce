// app/account/payment/page.tsx
'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, CreditCard, Trash2, Edit } from 'lucide-react'
import type { PaymentMethod } from '@/types/account'

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    userId: '1',
    type: 'card',
    cardLast4: '4242',
    cardBrand: 'Visa',
    cardExpMonth: 12,
    cardExpYear: 2025,
    isDefault: true,
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    userId: '1',
    type: 'card',
    cardLast4: '5555',
    cardBrand: 'Mastercard',
    cardExpMonth: 8,
    cardExpYear: 2026,
    isDefault: false,
    createdAt: new Date('2023-06-20'),
  }
]

export default function PaymentMethodsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
          <p className="text-muted-foreground">
            Manage your payment methods and billing information
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      <div className="grid gap-4">
        {mockPaymentMethods.map((method) => (
          <Card key={method.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">
                        {method.cardBrand} •••• {method.cardLast4}
                      </p>
                      {method.isDefault && (
                        <Badge variant="outline">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.cardExpMonth?.toString().padStart(2, '0')}/{method.cardExpYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockPaymentMethods.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No payment methods</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add a payment method to make checkout faster and easier.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Payment Method
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}






