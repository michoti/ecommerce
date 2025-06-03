"use client";

import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Category } from "@/lib/modules/cart/cart.types";

interface FilterSectionProps {
  query: {
    category: string;
    collection: string;
    sort: string;
    search: string;
  };
  setQuery: (query: Partial<FilterSectionProps["query"]>) => void;
  localSearch: string;
  setLocalSearch: (search: string) => void;
  categories: Category[];
}

export default function FilterSection({ query, setQuery, localSearch, setLocalSearch, categories }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const collections = categories
    .find((cat) => cat.id === query.category)
    ?.collections.map((col) => ({ id: col.id, name: col.name })) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between md:hidden">
        <h2 className="text-lg font-medium text-[#4d0000]">Filters</h2>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="border-[#ff4d4d] text-[#ff4d4d]" aria-label="Open filters">
              <Filter className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[90%] bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[#4d0000]">Filters</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close filters">
                <X className="h-5 w-5 text-[#990000]" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="search-mobile" className="block text-sm font-medium text-[#4d0000] mb-1">
                  Search
                </label>
                <Input
                  id="search-mobile"
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search products (2+ chars)"
                  className="border-gray-300 focus:ring-[#ff4d4d]"
                  aria-label="Search products"
                />
              </div>
              <div>
                <label htmlFor="category-mobile" className="block text-sm font-medium text-[#4d0000] mb-1">
                  Category
                </label>
                <select
                  id="category-mobile"
                  value={query.category}
                  onChange={(e) => setQuery({ category: e.target.value, collection: "all" })}
                  className="w-full p-2 border-b border-gray-200 focus:outline-none focus:ring-[#ff4d4d]"
                  aria-label="Select category"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {collections.length > 0 && (
                <div>
                  <label htmlFor="collection-mobile" className="block text-sm font-medium text-[#4d0000] mb-1">
                    Collection
                  </label>
                  <select
                    id="collection-mobile"
                    value={query.collection}
                    onChange={(e) => setQuery({ collection: e.target.value })}
                    className="w-full p-2 border-b border-gray-200 focus:outline-none focus:ring-[#ff4d4d]"
                    aria-label="Select collection"
                  >
                    <option value="all">All Collections</option>
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label htmlFor="sort-mobile" className="block text-sm font-medium text-[#4d0000] mb-1">
                  Sort
                </label>
                <select
                  id="sort-mobile"
                  value={query.sort}
                  onChange={(e) => setQuery({ sort: e.target.value })}
                  className="w-full p-2 border-b border-gray-200 focus:outline-none focus:ring-[#ff4d4d]"
                  aria-label="Select sort"
                >
                  <option value="default">Sort By</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating-high-low">Rating: High to Low</option>
                </select>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <select
            value={query.category}
            onChange={(e) => setQuery({ category: e.target.value, collection: "all" })}
            className="p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#ff4d4d] min-h-12"
            aria-label="Select category"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {collections.length > 0 && (
            <select
              value={query.collection}
              onChange={(e) => setQuery({ collection: e.target.value })}
              className="p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#ff4d4d] min-h-12"
              aria-label="Select collection"
            >
              <option value="all">All Collections</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search products (2+ chars)"
            className="p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#ff4d4d] min-h-12"
            aria-label="Search products"
          />
          <select
            value={query.sort}
            onChange={(e) => setQuery({ sort: e.target.value })}
            className="p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#ff4d4d] min-h-12"
            aria-label="Select sort"
          >
            <option value="default">Sort By</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating-high-low">Rating: High to Low</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}