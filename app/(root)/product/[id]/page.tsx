import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  GitCompare, 
  Star, 
  Plus, 
  Minus, 
  ShoppingCart,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { productData } from '@/lib/data';

const ProductPage = () => {
  const product = productData.products[1]; // Classic Matte Lip
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedShade, setSelectedShade] = useState(product.variants[0].shade);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const selectedVariant = product.variants.find(variant => variant.shade === selectedShade);
  const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Lips', href: '/lips' },
    { name: 'Lipsticks', href: '/lips/lipsticks' },
    { name: product.name, current: true }
  ];

  const features = [
    `Finish: ${product.finish}`,
    'Highly pigmented formula',
    'Long-lasting wear',
    'Infused with moisturizing ingredients'
  ];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((item, index) => (
                <li key={item.name}>
                  <div className="flex items-center">
                    {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}
                    {item.current ? (
                      <span className="text-gray-500 font-medium">{item.name}</span>
                    ) : (
                      <a href={item.href} className="text-blue-600 hover:text-blue-800 font-medium">
                        {item.name}
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <Card className="relative overflow-hidden bg-white p-8 aspect-square">
              <motion.div 
                className="relative w-full h-full group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={product.images[selectedImageIndex]}
                  alt={`${product.name} view ${selectedImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>

                {/* Zoom Icon */}
                <div className="absolute top-4 right-4 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Search className="h-5 w-5 text-gray-600" />
                </div>
              </motion.div>
            </Card>

            {/* Thumbnail Images */}
            <div className="flex space-x-3">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-contain bg-white p-2"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Category */}
            <div className="text-sm text-blue-600 font-medium">Lipsticks</div>

            {/* Product Title */}
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Reviews */}
            <div className="flex items-center space-x-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.round(product.avgRating) ? 'fill-current' : ''}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.reviews.length} customer reviews)</span>
            </div>

            {/* Brand and Availability */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">B</span>
                </div>
                <span className="text-sm font-medium">BeautyCo</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Availability:</span>
                <span className="text-green-600 font-medium ml-1">{totalStock} in stock</span>
              </div>
            </div>

            {/* Wishlist and Compare */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex items-center space-x-2 text-sm transition-colors ${
                  isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                <span>Wishlist</span>
              </button>
              <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <GitCompare className="h-5 w-5" />
                <span>Compare</span>
              </button>
            </div>

            {/* Features */}
            <div className="space-y-2">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center text-sm text-gray-700"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  {feature}
                </motion.div>
              ))}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.longDescription}
            </p>

            {/* SKU */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">SKU:</span> {selectedVariant?.sku}
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-bold text-gray-900">${selectedVariant?.price.toFixed(2)}</span>
            </div>

            {/* Shade Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">Shade</label>
              <div className="flex items-center space-x-2">
                <select 
                  value={selectedShade}
                  onChange={(e) => setSelectedShade(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.shade}>{variant.shade}</option>
                  ))}
                </select>
                <button 
                  onClick={() => setSelectedShade(product.variants[0].shade)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-8 rounded-md transition-colors">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to cart
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;