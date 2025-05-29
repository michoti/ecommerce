"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Heart, Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { productData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

// Define TypeScript interfaces for productData
interface Category {
  id: string;
  name: string;
  image: string;
  collections: Record<string, { name: string; productIds: number[] }>;
}

interface Product {
  id: number;
  name: string;
  image: string;
  finish?: string;
  coverage?: string;
  shortDescription: string;
  longDescription: string;
  variants: Array<{
    id: string;
    shade?: string;
    size?: string;
    price: number;
    sku: string;
    stock: number;
    notes?: string[];
  }>;
  avgRating: number;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    reviewer: string;
    date: string;
  }>;
}

interface ProductData {
  lastUpdated: string;
  products: Record<number, Product>;
  categories: Record<string, Category>;
  productReferences: { featured: number[]; bestSellers: number[] };
}

// Interface for API response
interface SearchResult {
  id: number;
  name: string;
  image: string;
  shortDescription: string;
  finish?: string;
  coverage?: string;
  variants: Array<{
    id: string;
    shade?: string;
    size?: string;
    price: number;
    sku: string;
    stock: number;
  }>;
  avgRating: number;
}

interface SearchResponse {
  results: SearchResult[];
  count: number;
  lastUpdated: string;
}

export default function Navbar() {
  const [scrollY, setScrollY] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Handle scroll and resize effects
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setLastScrollY(currentScrollY);
      setScrollY(currentScrollY);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // Search query using TanStack Query
  const { data, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      if (searchQuery.trim().length < 2) {
        return { results: [], count: 0, lastUpdated: "" };
      }
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    enabled: searchQuery.trim().length >= 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1, // Retry once on failure
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  });

  // Reset search when dialog/sheet closes
  const resetSearch = () => {
    setSearchQuery("");
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrollY > 20 ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex-1 md:flex-none">
          <Link href="/" className="text-xl font-semibold text-rose-900">
            STAR COSMETICS
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList className="bg-transparent">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-rose-50/50 text-rose-900">
                  Shop
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white/80 backdrop-blur-sm">
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {Object.values(productData.categories).map((category) => (
                      <li
                        key={category.id}
                        className="block select-none space-y-1 rounded-md p-3 hover:bg-rose-50/50"
                      >
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/category/${category.id}`}
                            className="flex gap-2 items-center"
                          >
                            <div className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center">
                              <span className="text-xs text-rose-700">{category.name[0]}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-rose-900">
                                {category.name}
                              </div>
                              <p className="text-xs text-slate-500">
                                Explore {category.name.toLowerCase()} products
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <ul className="pl-6 text-xs text-slate-600">
                          {Object.entries(category.collections).map(([collectionId, collection]) => (
                            <li key={collectionId}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={`/category/${category.id}/${collectionId}`}
                                  className="block py-1 hover:text-rose-700"
                                >
                                  {collection.name}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-rose-50/50 text-rose-900`}
                  href="/new-arrivals"
                >
                  New Arrivals
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-rose-50/50 text-rose-900`}
                  href="/best-sellers"
                >
                  Best Sellers
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-rose-50/50 text-rose-900`}
                  href="/about"
                >
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-4">
          <Dialog onOpenChange={(open) => !open && resetSearch()}>
            <DialogTrigger asChild>
              <button className="p-2 hover:bg-rose-50/50 rounded-full" aria-label="Search">
                <Search size={20} />
              </button>
            </DialogTrigger>
            <DialogContent className="w-[85vw] h-[85vh] max-w-[85vw] max-h-[85vh] bg-white/80 backdrop-blur-md rounded-lg p-6">
              <VisuallyHidden>
                <DialogTitle>Search Products</DialogTitle>
              </VisuallyHidden>
              <div className="w-full">
                <div className="flex items-center gap-2 mb-4">
                  <Search size={24} className="text-rose-900" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 text-rose-900 bg-transparent border-b border-rose-200 focus:outline-none focus:border-rose-700"
                    autoFocus
                  />
                  <DialogClose asChild>
                    <button className="p-2 hover:bg-rose-50/50 rounded-full" aria-label="Close search">
                      <X size={20} />
                    </button>
                  </DialogClose>
                </div>
                <div className="max-h-[70vh] overflow-y-auto">
                  {isLoading && <p className="text-rose-900 text-sm">Loading...</p>}
                  {error && <p className="text-red-600 text-sm">Failed to fetch search results. Please try again.</p>}
                  {!isLoading && !error && data?.results.length === 0 && searchQuery.length >= 2 && (
                    <p className="text-rose-900 text-sm">No products found.</p>
                  )}
                  {!isLoading && !error && data?.results.length > 0 && (
                    <ul className="grid gap-4 md:grid-cols-2">
                      {data.results.map((product) => (
                        <li key={product.id} className="flex gap-4 p-3 hover:bg-rose-50/50 rounded-md">
                          <Link href={`/product/${product.id}`} className="flex gap-4 w-full">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={80}
                              height={80}
                              className="rounded-md object-cover"
                            />
                            <div>
                              <h3 className="text-sm font-medium text-rose-900">{product.name}</h3>
                              <p className="text-xs text-slate-600">{product.shortDescription}</p>
                              <p className="text-xs text-rose-700">
                                {product.variants[0]?.price ? `$${product.variants[0].price.toFixed(2)}` : "Price unavailable"}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <button className="p-2 hover:bg-rose-50/50 rounded-full" aria-label="Account">
            <User size={20} />
          </button>
          <button className="p-2 hover:bg-rose-50/50 rounded-full" aria-label="Wishlist">
            <Heart size={20} />
          </button>
          <button className="p-2 hover:bg-rose-50/50 rounded-full" aria-label="Cart">
            <ShoppingBag size={20} />
          </button>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-rose-50/50 rounded-full" aria-label="Open menu">
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white/80 backdrop-blur-sm transition-transform duration-300 ease-in-out">
              <div className="flex justify-end">
                <SheetClose asChild>
                  <button className="p-2 hover:bg-rose-50/50 rounded-full" aria-label="Close menu">
                    <X size={20} />
                  </button>
                </SheetClose>
              </div>
              <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-6 mt-4">
                <h2 className="text-lg font-medium text-rose-900">Menu</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="shop">
                    <AccordionTrigger className="text-rose-900 hover:no-underline">
                      Shop
                    </AccordionTrigger>
                    <AccordionContent>
                      <Accordion type="single" collapsible className="pl-4">
                        {Object.values(productData.categories).map((category) => (
                          <AccordionItem key={category.id} value={category.id}>
                            <AccordionTrigger className="text-sm font-medium text-rose-700 hover:no-underline">
                              {category.name}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-col gap-2">
                                {Object.entries(category.collections).map(([collectionId, collection]) => (
                                  <Link
                                    key={collectionId}
                                    href={`/category/${category.id}/${collectionId}`}
                                    className="py-1 text-xs text-slate-600 hover:text-rose-700"
                                  >
                                    {collection.name}
                                  </Link>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="best-sellers">
                    <AccordionTrigger className="text-rose-900 hover:no-underline">
                      Best Sellers
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2 pl-4">
                        {productData.productReferences.bestSellers.map((productId) => (
                          <Link
                            key={productId}
                            href={`/product/${productId}`}
                            className="py-1 text-xs text-slate-600 hover:text-rose-700"
                          >
                            {productData.products[productId].name}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="new-arrivals">
                    <AccordionTrigger className="text-rose-900 hover:no-underline">
                      New Arrivals
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2 pl-4">
                        {productData.productReferences.featured.map((productId) => (
                          <Link
                            key={productId}
                            href={`/product/${productId}`}
                            className="py-1 text-xs text-slate-600 hover:text-rose-700"
                          >
                            {productData.products[productId].name}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="about">
                    <AccordionTrigger className="text-rose-900 hover:no-underline">
                      About
                    </AccordionTrigger>
                    <AccordionContent>
                      <Link
                        href="/about"
                        className="py-1 text-xs text-slate-600 hover:text-rose-700"
                      >
                        About Star Cosmetics
                      </Link>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 border-t border-rose-100/50 z-50">
          <div className="flex justify-around p-3">
            <Sheet onOpenChange={(open) => !open && resetSearch()}>
              <SheetTrigger asChild>
                <button className="flex flex-col items-center gap-1" aria-label="Search">
                  <Search size={20} />
                  <span className="text-xs text-rose-900">Search</span>
                </button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-white/80 backdrop-blur-md p-6">
                <SheetTitle className="sr-only">Search Products</SheetTitle>
                <div className="flex items-center gap-2 mb-4">
                  <Search size={24} className="text-rose-900" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 text-rose-900 bg-transparent border-b border-rose-200 focus:outline-none focus:border-rose-700"
                    autoFocus
                  />
                  <SheetClose asChild>
                    <button className="p-2 hover:bg-rose-50/50 rounded-full" aria-label="Close search">
                      <X size={20} />
                    </button>
                  </SheetClose>
                </div>
                <div className="max-h-[70vh] overflow-y-auto">
                  {isLoading && <p className="text-rose-900 text-sm">Loading...</p>}
                  {error && <p className="text-red-600 text-sm">Failed to fetch search results. Please try again.</p>}
                  {!isLoading && !error && data?.results.length === 0 && searchQuery.length >= 2 && (
                    <p className="text-rose-900 text-sm">No products found.</p>
                  )}
                  {!isLoading && !error && data?.results.length > 0 && (
                    <ul className="grid gap-4">
                      {data.results.map((product) => (
                        <li key={product.id} className="flex gap-4 p-3 hover:bg-rose-50/50 rounded-md">
                          <Link href={`/product/${product.id}`} className="flex gap-4 w-full">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={80}
                              height={80}
                              className="rounded-md object-cover"
                            />
                            <div>
                              <h3 className="text-sm font-medium text-rose-900">{product.name}</h3>
                              <p className="text-xs text-slate-600">{product.shortDescription}</p>
                              <p className="text-xs text-rose-700">
                                {product.variants[0]?.price ? `$${product.variants[0].price.toFixed(2)}` : "Price unavailable"}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <button className="flex flex-col items-center gap-1" aria-label="Account">
              <User size={20} />
              <span className="text-xs text-rose-900">Account</span>
            </button>
            <button className="flex flex-col items-center gap-1" aria-label="Wishlist">
              <Heart size={20} />
              <span className="text-xs text-rose-900">Wishlist</span>
            </button>
            <button className="flex flex-col items-center gap-1" aria-label="Cart">
              <ShoppingBag size={20} />
              <span className="text-xs text-rose-900">Cart</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}