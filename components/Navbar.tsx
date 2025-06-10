'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Heart, Search, ShoppingCart, User, Menu, X, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import { useWishlistStore } from '@/lib/modules/wishlist/wishlist.store';
import { useCartStore } from '@/lib/modules/cart/cart.store';
import { UserButton, useAuth, useUser } from '@clerk/nextjs';
import { useAuthStore } from '@/lib/auth.store';

const fetchCategories = async (): Promise<Category[]> => {
  // Fetch all products to extract categories and collections
  const response = await fetch('/api/search'); // Use high limit to get all products
  if (!response.ok) throw new Error('Failed to fetch categories');
  const { results } = await response.json();
  const categories = new Map<string, Category>();
  results.forEach((product: any) => {
    product.collections.forEach((collection: any) => {
      const category = collection.category;
      if (!categories.has(category.id)) {
        categories.set(category.id, { id: category.id, name: category.name, collections: [] });
      }
      const cat = categories.get(category.id)!;
      if (!cat.collections.some((c) => c.id === collection.id)) {
        cat.collections.push({ id: collection.id, name: collection.name });
      }
    });
  });
  return Array.from(categories.values());
};

const fetchSearchResults = async (query: string): Promise<SearchResponse> => {
  if (query.trim().length < 2) return { results: [], count: 0, totalCount: 0, page: 1, limit: 20, totalPages: 0, hasNextPage: false, hasPrevPage: false, lastUpdated: '' };
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to fetch search results');
  return response.json();
};

// Authentication Hook for consistent state management
const useAuthenticationState = () => {
  const { userId, isLoaded: clerkLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { setAuthState, clearAuthState, isLoading: authStoreLoading } = useAuthStore();

  // Sync Clerk auth state with Zustand store
  useEffect(() => {
    if (clerkLoaded) {
      if (isSignedIn && userId) {
        setAuthState(userId);
      } else {
        clearAuthState();
      }
    }
  }, [clerkLoaded, isSignedIn, userId, setAuthState, clearAuthState]);

  return {
    isAuthenticated: isSignedIn || false,
    isLoading: !clerkLoaded || authStoreLoading,
    userId,
    user,
  };
};

// Bottom Navigation Component
const BottomNavigation = () => {
  const pathname = usePathname();
  const { data: cart } = useCartQuery();
  const cartState = useCartStore((state) => state.cart);
  const wishlistItems = useWishlistStore((state) => state.items);
  const cartItemCount = getCartItemCount(cart || cartState);
  const { isAuthenticated, isLoading } = useAuthenticationState();

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

  // if (isLoading) {
  //   return (
  //     <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
  //       <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg">
  //         <div className="flex items-center justify-center px-4 py-4">
  //           <div className="animate-pulse text-gray-400">Loading...</div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
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
                      <motion.span
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </motion.span>
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

                  {/* Active indicator */}
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

// Auth Button Component for Desktop
const AuthButton = ({ isMobile = false }: { isMobile?: boolean }) => {
  const { isAuthenticated, isLoading, user } = useAuthenticationState();
  const { clearAuthState } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center">
        <div className="animate-pulse bg-gray-200 rounded-md w-20 h-8"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className={`flex items-center gap-2 ${isMobile ? 'flex-col w-full' : ''}`}>
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-8 h-8"
            }
          }}
        />
        {isMobile && (
          <span className="text-sm text-gray-600">
            {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${isMobile ? 'flex-col w-full space-y-2' : ''}`}>
      <Link href="/sign-in">
        <Button variant={isMobile ? "default" : "ghost"} size="sm">
          Sign In
        </Button>
      </Link>
      <Link href="/sign-up">
        <Button variant="outline" size="sm">
          Sign Up
        </Button>
      </Link>
    </div>
  );
};

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { data: cart } = useCartQuery();
  const cartState = useCartStore((state) => state.cart);
  const wishlistItems = useWishlistStore((state) => state.items);
  const cartItemCount = getCartItemCount(cart || cartState);
  
  // Initialize cart merge
  useCartMerge();

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => fetchSearchResults(searchQuery),
    enabled: searchQuery.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => setScrollY(window.scrollY);
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const resetSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  // Determine header background based on scroll position
  const headerBg = scrollY > 50
    ? 'bg-white/95 backdrop-blur-lg shadow-md'
    : scrollY > 0
      ? 'bg-white/80 backdrop-blur-sm'
      : 'bg-transparent';

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image src="/logo.png" alt="Star Cosmetics" width={120} height={40} />
                </motion.div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <NavigationMenu className="hidden md:flex">
                <NavigationMenu>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-900 hover:text-yellow-400 transition-colors duration-200">
                      Categories
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <motion.ul
                        className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {categoriesLoading
                          ? <div className="text-center py-4">Loading...</div>
                          : categories?.map((category) => (
                              <li key={category.id}>
                                <NavigationMenuLink asChild>
                                  <Accordion type="single" collapsible>
                                    <AccordionItem value={category.id} className="border-b-0">
                                      <AccordionTrigger className="text-sm font-medium text-gray-900 hover:text-yellow-400 transition-colors duration-200">
                                        {category.name}
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <ul className="space-y-2">
                                          {category.collections.map((collection) => (
                                            <li key={collection.id}>
                                              <Link
                                                href={`/shop?category=${category.id}&collection=${collection.id}`}
                                                className="text-sm text-gray-600 hover:text-yellow-400 transition-colors duration-200"
                                              >
                                                {collection.name}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                </NavigationMenuLink>
                              </li>
                            ))}
                      </motion.ul>
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
                </NavigationMenu>
              </NavigationMenu>
            )}

            {/* Desktop Right Icons */}
            <div className="flex items-center space-x-4">
              <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                      <Search className="h-5 w-5 text-gray-900" />
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <VisuallyHidden>
                    <DialogTitle>Search Products</DialogTitle>
                  </VisuallyHidden>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center border-b border-gray-200">
                      <Search className="h-5 w-5 text-gray-400 mx-2" />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-0 focus:ring-0"
                        autoFocus
                      />
                      {searchQuery && (
                        <Button variant="ghost" size="icon" onClick={resetSearch}>
                          <X className="h-5 w-5 text-gray-400" />
                        </Button>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {searchLoading ? (
                        <p className="text-center text-gray-600 py-4">Searching...</p>
                      ) : searchData?.results.length ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {searchData.results.map((product, index) => (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                              <Link
                                href={`/product/${product.slug}`}
                                className="flex items-center p-2 hover:bg-gray-100 transition-colors duration-200"
                                onClick={resetSearch}
                              >
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="object-contain mr-2 rounded"
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                  <p className="text-sm text-gray-600">
                                    ${Math.min(...product.variants.map((v) => v.price)).toFixed(2)}
                                  </p>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : searchQuery.trim().length >= 2 ? (
                        <p className="text-center text-gray-600 py-4">No results found</p>
                      ) : null}
                    </div>
                  </motion.div>
                </DialogContent>
              </Dialog>

              {/* Desktop Wishlist & Cart - Hidden on Mobile */}
              <div className="hidden md:flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link href="/wishlist" className="relative">
                    <Heart className="h-5 w-5 text-gray-900" />
                    {wishlistItems.length > 0 && (
                      <motion.span
                        className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        {wishlistItems.length}
                      </motion.span>
                    )}
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link href="/cart" className="relative">
                    <ShoppingCart className="h-5 w-5 text-gray-900" />
                    {cartItemCount > 0 && (
                      <motion.span
                        className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        {cartItemCount}
                      </motion.span>
                    )}
                  </Link>
                </motion.div>

                <AuthButton />
              </div>

              {/* Mobile Menu Trigger */}
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5 text-gray-900" />
                      </Button>
                    </motion.div>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px]">
                    <VisuallyHidden>
                      <SheetTitle>Menu</SheetTitle>
                    </VisuallyHidden>
                    <SheetClose className="absolute right-4 top-4">
                      <X className="h-5 w-5" />
                    </SheetClose>
                    <motion.div
                      className="mt-8"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="categories">
                          <AccordionTrigger>Categories</AccordionTrigger>
                          <AccordionContent>
                            {categoriesLoading
                              ? <div className="py-4">Loading...</div>
                              : categories?.map((category) => (
                                  <div key={category.id} className="ml-4 mb-4">
                                    <p className="font-medium text-gray-900 mb-2">{category.name}</p>
                                    <ul className="space-y-2">
                                      {category.collections.map((collection) => (
                                        <li key={collection.id}>
                                          <Link
                                            href={`/shop?category=${category.id}&collection=${collection.id}`}
                                            className="text-sm text-gray-600 hover:text-yellow-400 transition-colors duration-200"
                                            onClick={() => document.querySelector('[data-state="open"]')?.click()}
                                          >
                                            {collection.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      <Link
                        href="/shop"
                        className="block py-3 text-gray-900 hover:text-yellow-400 transition-colors duration-200 border-t border-gray-200 mt-4"
                      >
                        Shop
                      </Link>
                      
                      {/* Mobile Auth Section */}
                      <div className="border-t border-gray-200 mt-4 pt-4">
                        <AuthButton isMobile={true} />
                      </div>
                    </motion.div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />

      {/* Mobile Bottom Padding */}
      <div className="md:hidden h-20" />
    </>
  );
}