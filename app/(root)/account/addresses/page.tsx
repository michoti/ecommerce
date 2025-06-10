// app/account/addresses/page.tsx
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
import { MoreHorizontal, Plus, Search } from 'lucide-react'
import type { Address } from '@/types/account'

// Mock data
const mockAddresses: Address[] = [
  {
    id: '1',
    userId: '1',
    type: 'shipping',
    firstName: 'James',
    lastName: 'Newman',
    company: '',
    addressLine1: '2442 N Virginia Av.',
    addressLine2: '',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60610',
    country: 'United States',
    isDefault: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '2',
    userId: '1',
    type: 'billing',
    firstName: 'James',
    lastName: 'Newman',
    company: 'Newman Industries',
    addressLine1: '1234 Business St.',
    addressLine2: 'Suite 100',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60601',
    country: 'United States',
    isDefault: false,
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2024-11-15')
  }
]

const columns: ColumnDef<Address>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      return (
        <Badge variant={type === 'shipping' ? 'default' : 'secondary'}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    cell: ({ row }) => {
      const address = row.original
      return (
        <div>
          <div className="font-medium">
            {address.firstName} {address.lastName}
          </div>
          {address.company && (
            <div className="text-sm text-muted-foreground">
              {address.company}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => {
      const address = row.original
      return (
        <div className="space-y-1">
          <div>{address.addressLine1}</div>
          {address.addressLine2 && (
            <div>{address.addressLine2}</div>
          )}
          <div className="text-sm text-muted-foreground">
            {address.city}, {address.state} {address.postalCode}
          </div>
          <div className="text-sm text-muted-foreground">
            {address.country}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'isDefault',
    header: 'Default',
    cell: ({ row }) => {
      const isDefault = row.getValue('isDefault')
      return isDefault ? (
        <Badge variant="outline">Default</Badge>
      ) : null
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const address = row.original

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
            <DropdownMenuItem>Edit address</DropdownMenuItem>
            <DropdownMenuItem>Set as default</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Delete address
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function AddressesPage() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable({
    data: mockAddresses,
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Addresses</h1>
          <p className="text-muted-foreground">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Address Book</CardTitle>
          <CardDescription>
            Your saved shipping and billing addresses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search addresses..."
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
                      No addresses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
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