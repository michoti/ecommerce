"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ProductSection from "./ProductSection";
import Footer from "./Footer";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { productData } from "@/lib/data";


export default function LandingPage() {

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="scroll-smooth">
        <HeroSection />
        <ProductSection
          title="OUR FEATURED COLLECTION"
          description="Explore our handpicked selection of bestselling products loved by makeup artists and beauty enthusiasts worldwide"
          products={productData.featured}
        />
        {/* <ProductSection
          title="BEST SELLERS"
          description="Our most-loved products with thousands of 5-star reviews"
          products={productData.bestSellers}
        />
        <ProductSection
          title="SHOP BY CATEGORY"
          description="Find your perfect match in our curated collections"
          products={productData.categories}
        /> */}
        {/* Add other sections here as needed */}

        {/* Instagram Feed */}
        {/* <section className="min-h-screen bg-white py-20 flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl font-light mb-4 text-rose-900">SHOP OUR IG</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get inspired by our community and shop their favorite products
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="aspect-square overflow-hidden relative group"
                >
                  <img
                    src={`/api/placeholder/200/200`}
                    alt="Instagram post"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <a href="#" className="p-2 bg-white rounded-full">
                      <ArrowRight size={16} className="text-rose-800" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-rose-800 hover:text-rose-900 font-medium"
              >
                Follow Us @StarCosmetics <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section> */}

        {/* Newsletter */}
        {/* <section className="bg-rose-100 py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-xl mx-auto text-center"
            >
              <h2 className="text-3xl font-light mb-4 text-rose-900">SPECIAL FOR YOU</h2>
              <p className="text-gray-700 mb-6">
                Subscribe to our newsletter for exclusive offers, early access to new products, and beauty tips from our experts
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-rose-800"
                />
                <button className="px-6 py-3 bg-rose-800 text-white rounded-full hover:bg-rose-900 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </section> */}
        {/* <Footer /> */}
      </main>
    </div>
  );
}