'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

// Define the product type
interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  finish?: string;
  coverage?: string;
  variants: { price: number }[];
}

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: FC<ProductCardProps> = ({ product, index }) => {
  const router = useRouter();

  console.log(" this is my product :", product.slug)

  // Handle click to navigate to product details using slug
  const handleClick = () => {
    console.log("### slug before product click :", product);
    router.push(`/product/${product.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={index < 3} // Prioritize loading for first few cards
        />
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-600 mb-1">
          {product.finish || product.coverage || 'Product'}
        </p>
        <h3 className="font-medium text-[#4d0000]">{product.name}</h3>
        <p className="text-[#990000]">
          ${Math.min(...product.variants.map((v) => v.price)).toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;