"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HeroSection() {

  const router = useRouter();
  // Text to animate letter by letter
  const titleText = "ELEVATE BEAUTY";
  const subtitleText = "Discover our collection of luxury makeup and skincare products";

  // Animation variants for the letters
  const letterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  // Animation variants for the subtitle text
  const subtitleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: titleText.length * 0.1 + 0.5, // Start after title animation plus a small delay
        duration: 0.8
      }
    }
  };

  const handleClick = () => {
     router.push('/shop');
  }

  return (
    <section
      className="min-h-screen flex items-center bg-rose-50 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg-secondary.jpg')" }}
    >
      <div className="container mx-auto px-4 py-20 md:py-0 flex justify-center">
        <div className="text-center md:w-1/2">
          <h1 className="text-4xl md:text-6xl font-light mb-4 text-rose-900 flex justify-center flex-wrap">
            {titleText.split('').map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>
          
          <motion.p
            className="text-lg md:text-xl mb-8 text-white"
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
          >
            {subtitleText}
          </motion.p>
          
          <motion.button
            className="px-8 py-3 bg-rose-800 text-white rounded-full hover:bg-rose-900 transition-colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: (titleText.length * 0.1) + 1.3 // Appear after subtitle
            }}
            onClick={handleClick}
          >
            SHOP NOW
          </motion.button>
        </div>
      </div>
    </section>
  );
}