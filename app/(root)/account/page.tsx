// app/account/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Package, MapPin, CreditCard } from 'lucide-react'
import Link from 'next/link'
import type { User as UserType, Order, Address, PaymentMethod } from '@/types/account'

// Mock data - replace with actual data fetching
const mockUser: UserType = {
  id: '1',
  email: 'james.newman@example.com',
  firstName: 'James',
  lastName: 'Newman',
  phone: '+1 (555) 123-4567',
  createdAt: new Date('2023-01-15'),
  updatedAt: new Date('2024-12-01')
}

const recentOrders: Order[] = [
  {
    id: '1',
    userId: '1',
    orderNumber: 'ORD-2024-001',
    status: 'delivered',
    total: 89.99,
    currency: 'USD',
    items: [],
    shippingAddress: {} as Address,
    billingAddress: {} as Address,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-05')
  },
  {
    id: '2',
    userId: '1',
    orderNumber: 'ORD-2024-002',
    status: 'shipped',
    total: 156.50,
    currency: 'USD',
    items: [],
    shippingAddress: {} as Address,
    billingAddress: {} as Address,
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-12-02')
  }
]

function getStatusColor(status: Order['status']) {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'shipped':
      return 'bg-blue-100 text-blue-800'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'pending':
      return 'bg-gray-100 text-gray-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function Accountpage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Overview</h1>
        <p className="text-muted-foreground">
          Manage your account settings and view your activity
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={mockUser.avatar} />
              <AvatarFallback>
                {mockUser.firstName[0]}{mockUser.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {mockUser.firstName} {mockUser.lastName}
              </h3>
              <p className="text-muted-foreground">{mockUser.email}</p>
              {mockUser.phone && (
                <p className="text-muted-foreground">{mockUser.phone}</p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                Member since {mockUser.createdAt.toLocaleDateString()}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/account/settings">Edit Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Addresses</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              1 shipping, 1 billing
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Visa ending in 4242
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Your latest orders and their status
              </CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/account/orders">View All Orders</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${order.total.toFixed(2)}
                  </p>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/account/orders/${order.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}