# Bug fix backlog

-   [] add to cart is failing for both authenticated and unauthenticated
-   [] add to cart is failing from wishlist page
-   [] format navbar to enterprise level
-   [x] create the mobile bottom navbar
-   [] cart store is still using productData

===================================================================

-   [] create a database schema
-   [] implement cart management
-   [] add clerk authentication
-   [] tidy up the shop page to integrate with navbar search
-   [] fix the bottom navbar
-   [] implement reviews management
-   [] implement production database (use Neon)
-   [] checkout the jneedle auth handling

'use client';

import {
NavigationMenu,
NavigationMenuContent,
NavigationMenuItem,
NavigationMenuLink,
NavigationMenuList,
NavigationMenuTrigger,
navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Heart, Search, ShoppingCart, User, Menu, X, Home, Loader2 } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useCartQuery } from '@/lib/modules/cart/cart.queries';
import { getCartItemCount } from '@/lib/modules/cart/cart.utils';
import { useCartMerge } from '@/lib/modules/cart/useCartMerge';
import { SearchResponse, Category } from '@/lib/modules/cart/cart.types';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWishlistStore } from '@/lib/modules/wishlist/wishlist.store';
import { useCartStore } from '@/lib/modules/cart/cart.store';
import { SignOutButton, UserButton } from '@clerk/nextjs';
import { useAuthStore } from '@/lib/auth.store';
import { useDebounce } from '@/lib/hooks/useDebounce';

// Fetch categories with better error handling and caching
const fetchCategories = async (): Promise<Category[]> => {
try {
const response = await fetch('/api/search', {
method: 'GET',
headers: {
'Content-Type': 'application/json',
}
});

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid response format');
    }

    // Build categories from products
    const categoriesMap = new Map<string, Category>();

    data.results.forEach((product: any) => {
      if (product.collections && Array.isArray(product.collections)) {
        product.collections.forEach((collection: any) => {
          if (collection.category) {
            const category = collection.category;
            if (!categoriesMap.has(category.id)) {
              categoriesMap.set(category.id, {
                id: category.id,
                name: category.name,
                collections: []
              });
            }

            const cat = categoriesMap.get(category.id)!;
            const existingCollection = cat.collections.find(c => c.id === collection.id);

            if (!existingCollection) {
              cat.collections.push({
                id: collection.id,
                name: collection.name,
                products: [product]
              });
            } else {
              existingCollection.products.push(product);
            }
          }
        });
      }
    });

    return Array.from(categoriesMap.values());

} catch (error) {
console.error('Error fetching categories:', error);
throw error;
}
};

// Improved search function with better error handling
const fetchSearchResults = async (query: string): Promise<SearchResponse> => {
if (!query || query.trim().length < 2) {
return { results: [], count: 0, totalCount: 0, lastUpdated: '' };
}

try {
const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=10`, {
method: 'GET',
headers: {
'Content-Type': 'application/json',
}
});

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      results: data.results || [],
      count: data.count || 0,
      totalCount: data.totalCount || 0,
      lastUpdated: data.lastUpdated || new Date().toISOString()
    };

} catch (error) {
console.error('Search error:', error);
return { results: [], count: 0, totalCount: 0, lastUpdated: '' };
}
};

// Search Results Component
const SearchResults = ({
searchData,
searchLoading,
searchQuery,
onResultClick
}: {
searchData?: SearchResponse;
searchLoading: boolean;
searchQuery: string;
onResultClick: () => void;
}) => {
if (searchLoading) {
return (
<div className="flex items-center justify-center py-8">
<Loader2 className="h-6 w-6 animate-spin text-gray-400" />
<span className="ml-2 text-gray-600">Searching...</span>
</div>
);
}

if (!searchData?.results.length) {
if (searchQuery.trim().length >= 2) {
return (
<div className="text-center py-8">
<p className="text-gray-600">No products found for "{searchQuery}"</p>
<p className="text-sm text-gray-400 mt-2">Try different keywords or browse our categories</p>
</div>
);
}
return null;
}

return (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.3 }}
className="space-y-2" >
<div className="text-sm text-gray-500 px-4 py-2 border-b">
{searchData.count} result{searchData.count !== 1 ? 's' : ''} found
</div>

      {searchData.results.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <Link
            href={`/product/${product.slug}`}
            className="flex items-center p-3 hover:bg-gray-50 transition-colors duration-200 group"
            onClick={onResultClick}
          >
            <div className="relative w-12 h-12 mr-3 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="48px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-yellow-600 transition-colors">
                {product.name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {product.shortDescription}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm font-semibold text-gray-900">
                  ${product.variants && product.variants.length > 0
                    ? Math.min(...product.variants.map(v => v.price)).toFixed(2)
                    : '0.00'
                  }
                </p>
                {product.avgRating > 0 && (
                  <div className="flex items-center">
                    <span className="text-xs text-yellow-500">★</span>
                    <span className="text-xs text-gray-600 ml-1">{product.avgRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>

);
};

// Bottom Navigation Component
const BottomNavigation = () => {
const pathname = usePathname();
const { data: cart } = useCartQuery();
const cartState = useCartStore((state) => state.cart);
const wishlistItems = useWishlistStore((state) => state.items);
const cartItemCount = getCartItemCount(cart || cartState);
const { isAuthenticated, isLoading } = useAuthStore();

const navItems = [
{ href: '/', icon: Home, label: 'Home' },
{ href: '/wishlist', icon: Heart, label: 'Wishlist', badge: wishlistItems.length },
{ href: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartItemCount },
{
href: isAuthenticated ? '/account' : '/sign-in',
icon: User,
label: isAuthenticated ? 'Account' : 'Sign In',
},
];

if (isLoading) {
return null;
}

return (
<motion.div
className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
initial={{ y: 100 }}
animate={{ y: 0 }}
transition={{ duration: 0.3, ease: 'easeOut' }} >
<div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg">
<div className="flex items-center justify-around px-4 py-2">
{navItems.map((item) => {
const isActive = pathname === item.href;
const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <motion.div
                  className="flex flex-col items-center py-2 px-3 relative"
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  <motion.div
                    className="relative"
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0,
                    }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                  >
                    <Icon
                      className={`h-6 w-6 transition-colors duration-200 ${
                        isActive ? 'text-yellow-500' : 'text-gray-600'
                      }`}
                    />
                    {item.badge && item.badge > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs font-medium"
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </Badge>
                    )}
                  </motion.div>
                  <motion.span
                    className={`text-xs mt-1 font-medium transition-colors duration-200 ${
                      isActive ? 'text-yellow-500' : 'text-gray-600'
                    }`}
                    animate={{
                      opacity: isActive ? 1 : 0.8,
                    }}
                  >
                    {item.label}
                  </motion.span>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="absolute -top-1 left-1/2 w-1 h-1 bg-yellow-500 rounded-full"
                        initial={{ scale: 0, x: '-50%' }}
                        animate={{ scale: 1, x: '-50%' }}
                        exit={{ scale: 0, x: '-50%' }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>

);
};

export default function Navbar() {
const [scrollY, setScrollY] = useState(0);
const [isMobile, setIsMobile] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [isSearchOpen, setIsSearchOpen] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const pathname = usePathname();
const { data: cart } = useCartQuery();
const cartState = useCartStore((state) => state.cart);
const wishlistItems = useWishlistStore((state) => state.items);
const cartItemCount = getCartItemCount(cart || cartState);
const { isAuthenticated, isLoading } = useAuthStore();

useCartMerge();

// Debounce search query to avoid too many API calls
const debouncedSearchQuery = useDebounce(searchQuery, 300);

const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
queryKey: ['categories'],
queryFn: fetchCategories,
staleTime: 10 _ 60 _ 1000, // 10 minutes
cacheTime: 30 _ 60 _ 1000, // 30 minutes
retry: 2,
refetchOnWindowFocus: false,
});

const { data: searchData, isLoading: searchLoading } = useQuery({
queryKey: ['search', debouncedSearchQuery],
queryFn: () => fetchSearchResults(debouncedSearchQuery),
enabled: debouncedSearchQuery.trim().length >= 2,
staleTime: 5 _ 60 _ 1000, // 5 minutes
retry: 1,
refetchOnWindowFocus: false,
});

useEffect(() => {
const handleResize = () => setIsMobile(window.innerWidth < 768);
const handleScroll = () => setScrollY(window.scrollY);

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };

}, []);

const resetSearch = useCallback(() => {
setSearchQuery('');
setIsSearchOpen(false);
}, []);

const handleSearchResultClick = useCallback(() => {
resetSearch();
}, [resetSearch]);

const closeMobileMenu = useCallback(() => {
setIsMobileMenuOpen(false);
}, []);

// Determine header background based on scroll position
const headerBg = scrollY > 50
? 'bg-white/95 backdrop-blur-lg shadow-md'
: scrollY > 0
? 'bg-white/80 backdrop-blur-sm'
: 'bg-transparent';

if (isLoading) {
return (
<motion.header
className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
initial={{ y: -100 }}
animate={{ y: 0 }}
transition={{ duration: 0.5 }} >
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex items-center justify-between h-16">
<div className="flex items-center">
<Link href="/">
<motion.div
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
transition={{ duration: 0.2 }} >
<Image src="/logo.png" alt="Star Cosmetics" width={120} height={40} />
</motion.div>
</Link>
</div>
<div className="flex items-center">
<Loader2 className="h-5 w-5 animate-spin text-gray-600" />
<span className="ml-2 text-gray-600">Loading...</span>
</div>
</div>
</div>
</motion.header>
);
}

return (
<>
<motion.header
className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
initial={{ y: -100 }}
animate={{ y: 0 }}
transition={{ duration: 0.5 }} >
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex items-center justify-between h-16">
<div className="flex items-center">
<Link href="/">
<motion.div
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
transition={{ duration: 0.2 }} >
<Image src="/logo.png" alt="Star Cosmetics" width={120} height={40} />
</motion.div>
</Link>
</div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-900 hover:text-yellow-400 transition-colors duration-200">
                      Categories
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <motion.div
                        className="w-[400px] p-4 md:w-[500px] lg:w-[600px]"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {categoriesLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                            <span className="ml-2 text-gray-600">Loading categories...</span>
                          </div>
                        ) : categoriesError ? (
                          <div className="text-center py-8">
                            <p className="text-red-600">Failed to load categories</p>
                            <p className="text-sm text-gray-500 mt-1">Please try again later</p>
                          </div>
                        ) : categories && categories.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4">
                            {categories.map((category) => (
                              <div key={category.id} className="space-y-2">
                                <h4 className="font-medium text-gray-900 hover:text-yellow-400 transition-colors duration-200">
                                  {category.name}
                                </h4>
                                <ul className="space-y-1">
                                  {category.collections.slice(0, 5).map((collection) => (
                                    <li key={collection.id}>
                                      <Link
                                        href={`/shop?category=${category.id}&collection=${collection.id}`}
                                        className="text-sm text-gray-600 hover:text-yellow-400 transition-colors duration-200 block"
                                      >
                                        {collection.name}
                                      </Link>
                                    </li>
                                  ))}
                                  {category.collections.length > 5 && (
                                    <li>
                                      <Link
                                        href={`/shop?category=${category.id}`}
                                        className="text-sm text-yellow-600 hover:text-yellow-400 transition-colors duration-200 block"
                                      >
                                        View all {category.name} →
                                      </Link>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-600">No categories available</p>
                          </div>
                        )}
                      </motion.div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/shop"
                      className={`${navigationMenuTriggerStyle()} transition-colors duration-200 hover:text-yellow-400`}
                    >
                      Shop
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}

            {
