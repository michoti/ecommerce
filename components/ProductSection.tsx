import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ProductSection({ title, description, products }) {
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
          {products.map((product, index) => (
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
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-2 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                  <button className="w-full py-2 bg-rose-800 text-white text-sm rounded-full hover:bg-rose-900 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">{product.type}</p>
                <h3 className="font-medium text-rose-900">{product.name}</h3>
                <p className="text-gray-700">${product.price}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-rose-800 hover:text-rose-900 font-medium"
          >
            View All Products <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}