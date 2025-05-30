"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { parseAsString, useQueryStates } from "nuqs";
import { useMemo, useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard"; // Adjust path as needed
import { productData } from "@/lib/data"; // Adjust path as needed

// Define product types (unchanged from your code)
interface Variant {
  price: number;
  shade?: string;
  size?: string;
}

interface Product {
  id: number;
  name: string;
  image: string;
  finish?: string;
  coverage?: string;
  shortDescription: string;
  variants: Variant[];
  avgRating: number;
}

interface Category {
  id: string;
  name: string;
  collections: { [key: string]: { name: string; productIds: number[] } };
}

// Simulated data fetching function (replace with API call if needed)
const fetchProductData = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return productData as {
    products: Record<number, Product>;
    categories: Record<string, Category>;
  };
};

const ShopPage = () => {
  // Manage query parameters with nuqs
  const [query, setQuery] = useQueryStates({
    category: parseAsString.withDefault("all"),
    collection: parseAsString.withDefault("all"),
    sort: parseAsString.withDefault("default"),
    search: parseAsString.withDefault(""),
  });

  // Fetch product data with react-query
  const { data, isLoading, error } = useQuery({
    queryKey: ["productData"],
    queryFn: fetchProductData,
  });

  // Debounce search query updates (to prevent excessive URL updates)
  const [localSearch, setLocalSearch] = useState(query.search);
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery({ search: localSearch });
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, setQuery]);

  // Extract products and categories
  const products: Product[] = useMemo(
    () => (data ? Object.values(data.products) : []),
    [data]
  );
  const categories: Category[] = useMemo(
    () => (data ? Object.values(data.categories) : []),
    [data]
  );

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category and collection
    if (query.category !== "all" && data) {
      const category = data.categories[query.category];
      if (category) {
        let productIds: number[] = [];
        if (query.collection === "all") {
          Object.values(category.collections).forEach((collection) => {
            productIds = [...productIds, ...collection.productIds];
          });
        } else {
          productIds = category.collections[query.collection]?.productIds || [];
        }
        result = result.filter((product) => productIds.includes(product.id));
      }
    }

    // Filter by search query
    if (query.search.trim()) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query.search.toLowerCase())
      );
    }

    // Sort products
    switch (query.sort) {
      case "price-low-high":
        return result.sort(
          (a, b) =>
            Math.min(...a.variants.map((v) => v.price)) -
            Math.min(...b.variants.map((v) => v.price))
        );
      case "price-high-low":
        return result.sort(
          (a, b) =>
            Math.min(...b.variants.map((v) => v.price)) -
            Math.min(...a.variants.map((v) => v.price))
        );
      case "rating-high-low":
        return result.sort((a, b) => b.avgRating - a.avgRating);
      default:
        return result;
    }
  }, [query, data]);

  // Get collections for the selected category
  const collections = useMemo(
    () =>
      query.category === "all"
        ? []
        : Object.entries(data?.categories[query.category]?.collections || {}).map(
            ([key, value]) => ({ id: key, name: value.name })
          ),
    [data, query.category]
  );

  if (isLoading) {
    return (
      <div className="container mx-auto my-8 px-4 py-8">
        <div className="animate-pulse text-center text-rose-900">
          Loading products...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto my-8 px-4 py-8">
        <p className="text-center text-rose-900">
          Error loading products: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-16 my-6 lg:mx-24 pt-20 lg:pt-28">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <select
              value={query.category}
              onChange={(e) =>
                setQuery({
                  category: e.target.value,
                  collection: "all", // Reset collection when category changes
                })
              }
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Collection Filter */}
            {collections.length > 0 && (
              <select
                value={query.collection}
                onChange={(e) => setQuery({ collection: e.target.value })}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
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

          {/* Search and Sorting */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search products..."
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <select
              value={query.sort}
              onChange={(e) => setQuery({ sort: e.target.value })}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="default">Sort By: Default</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating-high-low">Rating: High to Low</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-600 text-center">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id.toString(),
                name: product.name,
                image: product.image,
                finish: product.finish,
                coverage: product.coverage,
                variants: product.variants,
              }}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;