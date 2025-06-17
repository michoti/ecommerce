import { useMutation, useQuery } from '@tanstack/react-query';
import { ShippingAddress, BillingAddress } from './types';

const fetchShippingAddresses = async (): Promise<ShippingAddress[]> => {
  const response = await fetch('/api/shipping-addresses');
  if (!response.ok) throw new Error('Failed to fetch shipping addresses');
  return response.json();
};

const createShippingAddress = async (address: Partial<ShippingAddress>): Promise<ShippingAddress> => {
  const response = await fetch('/api/shipping-addresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(address),
  });
  if (!response.ok) throw new Error('Failed to create shipping address');
  return response.json();
};

const createBillingAddress = async (address: Partial<BillingAddress>): Promise<BillingAddress> => {
  const response = await fetch('/api/billing-addresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(address),
  });
  if (!response.ok) throw new Error('Failed to create billing address');
  return response.json();
};

export const useShippingAddressesQuery = () =>
  useQuery({
    queryKey: ['shippingAddresses'],
    queryFn: () => fetchShippingAddresses,
  });

export const useCreateShippingAddressMutation = () =>
  useMutation({
    mutationFn: createShippingAddress,
    onError: (error) => {
      console.error('Shipping address creation failed:', error);
    },
  });

export const useCreateBillingAddressMutation = () =>
  useMutation({
    mutationFn: createBillingAddress,
    onError: (error) => {
      console.error('Billing address creation failed:', error);
    },
  });