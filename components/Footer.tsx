import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { productData } from "@/lib/data";

export default function Footer() {

  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-medium mb-4 text-rose-900">STAR COSMETICS</h3>
            <p className="text-gray-600 mb-6">
              Luxury beauty products crafted with care for the modern individual.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://facebook.com/stiscosmetics"
                className="p-2 bg-rose-50 rounded-full hover:bg-rose-100 transition-colors"
                aria-label="Visit our Facebook page"
              >
                <Facebook size={20} className="text-rose-800" />
              </Link>
              <Link
                href="https://twitter.com/stiscosmetics"
                className="p-2 bg-rose-50 rounded-full hover:bg-rose-100 transition-colors"
                aria-label="Visit our Twitter page"
              >
                <Twitter size={20} className="text-rose-800" />
              </Link>
              <Link
                href="https://instagram.com/stiscosmetics"
                className="p-2 bg-rose-50 rounded-full hover:bg-rose-100 transition-colors"
                aria-label="Visit our Instagram page"
              >
                <Instagram size={20} className="text-rose-800" />
              </Link>
              <Link
                href="https://youtube.com/stiscosmetics"
                className="p-2 bg-rose-50 rounded-full hover:bg-rose-100 transition-colors"
                aria-label="Visit our YouTube channel"
              >
                <Youtube size={20} className="text-rose-800" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-rose-900">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products/featured"
                  className="text-gray-600 hover:text-rose-800 transition-colors"
                >
                  Featured
                </Link>
              </li>
              <li>
                <Link
                  href="/products/best-sellers"
                  className="text-gray-600 hover:text-rose-800 transition-colors"
                >
                  Best Sellers
                </Link>
              </li>
              {Object.values(productData.categories).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/products/${category.id}`}
                    className="text-gray-600 hover:text-rose-800 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-rose-900">Help</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-rose-800 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-gray-600 hover:text-rose-800 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-returns"
                  className="text-gray-600 hover:text-rose-800 transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="text-gray-600 hover:text-rose-800 transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-rose-800 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="text-gray-600 hover:text-rose-800 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-rose-900">About</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about/our-story"
                  className="text-gray-600 hover:text-rose-800 transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/about/sustainability"
                  className="text-gray-600 hover:text-rose-800 transition-colors"
                >
                  Sustainability
                </Link>
              </li>
              <li>
                <Link
                  href="/about/careers"
                  className="text-gray-600 hover:text-rose-800 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/about/press"
                  className="text-gray-600 hover:text-rose-800 transition-colors"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-rose-800 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/store-locator"
                  className="text-gray-600 hover:text-rose-800 transition-colors"
                >
                  Store Locator
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2025 STAR COSMETICS. All rights reserved.</p>
            <div className="flex gap-6">
              <Link
                href="/privacy-policy"
                className="text-gray-500 text-sm hover:text-rose-800 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-gray-500 text-sm hover:text-rose-800 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/accessibility"
                className="text-gray-500 text-sm hover:text-rose-800 transition-colors"
              >
                Accessibility
              </Link>
            </div>
            <div className="text-gray-500 text-sm">
              We accept: Visa, MasterCard, PayPal, Amex
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}