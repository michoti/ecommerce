"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { productData } from "@/lib/data";

// Define TypeScript interfaces based on productData structure
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

interface Category {
  id: string;
  name: string;
  image: string;
  collections: Record<string, { name: string; productIds: number[] }>;
}

interface ProductSectionProps {
  title: string;
  description: string;
  products: number[] | Record<string, Category>;
}

export default function ProductSection({ title, description, products }: ProductSectionProps) {
  // Helper function to determine if products is an array of IDs or categories
  const isProductIds = Array.isArray(products);

  // Map product IDs to full product data for Featured and Best Sellers
  const productList: Product[] | undefined = isProductIds
    ? products
        .map((id) => productData.products[id])
        .filter((product): product is Product => product !== undefined)
    : undefined;

  // Map categories for Shop by Category
  const categoryList: Category[] | undefined = !isProductIds
    ? Object.values(products)
    : undefined;

  return (
    <section className="min-h-screen bg-white py-20 flex items-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-light mb-4 text-rose-900">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {productList &&
            productList.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">
                    {product.finish || product.coverage || "Product"}
                  </p>
                  <h3 className="font-medium text-rose-900">{product.name}</h3>
                  <p className="text-gray-700">
                    ${Math.min(...product.variants.map((v) => v.price)).toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          {categoryList &&
            categoryList.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <a href={`/category/${category.id}`}>
                  <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gray-100">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-rose-900">{category.name}</h3>
                    <p className="text-xs text-gray-500">
                      {Object.values(category.collections).length} Collections
                    </p>
                  </div>
                </a>
              </motion.div>
            ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={isProductIds ? "/products" : "/categories"}
            className="inline-flex items-center gap-2 text-rose-800 hover:text-rose-900 font-medium"
          >
            View All {isProductIds ? "Products" : "Categories"} <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}