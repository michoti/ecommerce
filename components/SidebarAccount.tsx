
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  Mail, 
  Shield, 
  Settings,
  LogOut,
  ShoppingBag
} from 'lucide-react'

const sidebarItems = [
  {
    title: 'Account',
    href: '/account',
    icon: User,
  },
  {
    title: 'Orders',
    href: '/account/orders',
    icon: Package,
  },
  {
    title: 'Addresses',
    href: '/account/addresses',
    icon: MapPin,
  },
  {
    title: 'Payment Methods',
    href: '/account/payment',
    icon: CreditCard,
  },
  {
    title: 'Email Preferences',
    href: '/account/emails',
    icon: Mail,
  },
  {
    title: 'Privacy & Security',
    href: '/account/security',
    icon: Shield,
  },
  {
    title: 'Settings',
    href: '/account/settings',
    icon: Settings,
  },
]

export function SidebarAccount() {
  const pathname = usePathname()

  return (
    <div className="space-y-2">
      <div className="pb-4 border-b">
        <h2 className="text-lg font-semibold">Your Account</h2>
      </div>
      
      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-orange-50 text-orange-700 border-l-2 border-orange-500" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="pt-4 border-t">
        <button className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 w-full">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}