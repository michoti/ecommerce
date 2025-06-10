'use client'

import React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnDef,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Search, Eye, Download, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import type { Order } from '@/types/account'

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    userId: '1',
    orderNumber: 'ORD-2024-001',
    status: 'delivered',
    total: 89.99,
    currency: 'USD',
    items: [
      {
        id: '1',
        orderId: '1',
        productId: '1',
        productName: 'Handmade Ceramic Mug',
        productImage: '/images/mug.jpg',
        quantity: 2,
        price: 24.99,
        total: 49.98
      },
      {
        id: '2',
        orderId: '1',
        productId: '2',
        productName: 'Artisan Coffee Beans',
        quantity: 1,
        price: 39.99,
        total: 39.99
      }
    ],
    shippingAddress: {} as any,
    billingAddress: {} as any,
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
    shippingAddress: {} as any,
    billingAddress: {} as any,
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-12-02')
  },
  {
    id: '3',
    userId: '1',
    orderNumber: 'ORD-2024-003',
    status: 'processing',
    total: 67.25,
    currency: 'USD',
    items: [],
    shippingAddress: {} as any,
    billingAddress: {} as any,
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-11-26')
  }
]

function getStatusColor(status: Order['status']) {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800 hover:bg-green-200'
    case 'shipped':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
    case 'pending':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 hover:bg-red-200'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  }
}

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'orderNumber',
    header: 'Order Number',
    cell: ({ row }) => {
      const order = row.original
      return (
        <Link 
          href={`/account/orders/${order.id}`}
          className="font-medium text-blue-600 hover:text-blue-800"
        >
          {order.orderNumber}
        </Link>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Order['status']
      return (
        <Badge className={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('total'))
      const currency = row.original.currency
      return (
        <div className="font-medium">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
          }).format(amount)}
        </div>
      )
    },
  },
  {
    accessorKey: 'items',
    header: 'Items',
    cell: ({ row }) => {
      const items = row.getValue('items') as Order['items']
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
      return <div>{totalItems} item{totalItems !== 1 ? 's' : ''}</div>
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/account/orders/${order.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </DropdownMenuItem>
            {order.status === 'delivered' && (
              <DropdownMenuItem>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reorder Items
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {order.status === 'pending' && (
              <DropdownMenuItem className="text-red-600">
                Cancel Order
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function OrdersPage() {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'createdAt', desc: true }
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable({
    data: mockOrders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Orders</h1>
        <p className="text-muted-foreground">
          Track and manage your order history
        </p>
      </div>

      {/* Order Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOrders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockOrders.filter(o => o.status === 'delivered').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockOrders.filter(o => o.status === 'shipped').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            All your orders with their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={globalFilter ?? ''}
                onChange={(event) => setGlobalFilter(String(event.target.value))}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}