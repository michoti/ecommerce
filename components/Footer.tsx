import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Accordion type="single" collapsible className="md:hidden">
          <AccordionItem value="brand">
            <AccordionTrigger className="text-[#4d0000] font-medium">Star Cosmetics</AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-600 mb-4">Luxury beauty products crafted with care.</p>
              <div className="flex gap-3">
                <Link
                  href="https://facebook.com/stiscosmetics"
                  className="p-2 bg-[#ff4d4d]/10 rounded-full hover:bg-[#ff4d4d]/20"
                  aria-label="Facebook"
                >
                  <Facebook size={18} className="text-[#990000]" />
                </Link>
                <Link
                  href="https://twitter.com/stiscosmetics"
                  className="p-2 bg-[#ff4d4d]/10 rounded-full hover:bg-[#ff4d4d]/20"
                  aria-label="Twitter"
                >
                  <Twitter size={18} className="text-[#990000]" />
                </Link>
                <Link
                  href="https://instagram.com/stiscosmetics"
                  className="p-2 bg-[#ff4d4d]/10 rounded-full hover:bg-[#ff4d4d]/20"
                  aria-label="Instagram"
                >
                  <Instagram size={18} className="text-[#990000]" />
                </Link>
                <Link
                  href="https://youtube.com/stiscosmetics"
                  className="p-2 bg-[#ff4d4d]/10 rounded-full hover:bg-[#ff4d4d]/20"
                  aria-label="YouTube"
                >
                  <Youtube size={18} className="text-[#990000]" />
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shop">
            <AccordionTrigger className="text-[#4d0000] font-medium">Shop</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                <li>
                  <Link href="/products/featured" className="text-gray-600 hover:text-[#ff4d4d]">
                    Featured
                  </Link>
                </li>
                <li>
                  <Link href="/products/best-sellers" className="text-gray-600 hover:text-[#ff4d4d]">
                    Best Sellers
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="help">
            <AccordionTrigger className="text-[#4d0000] font-medium">Help</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-[#ff4d4d]">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="text-gray-600 hover:text-[#ff4d4d]">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-returns" className="text-gray-600 hover:text-[#ff4d4d]">
                    Shipping & Returns
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="about">
            <AccordionTrigger className="text-[#4d0000] font-medium">About</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                <li>
                  <Link href="/about/our-story" className="text-gray-600 hover:text-[#ff4d4d]">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/about/sustainability" className="text-gray-600 hover:text-[#ff4d4d]">
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link href="/about/careers" className="text-gray-600 hover:text-[#ff4d4d]">
                    Careers
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-medium mb-4 text-[#4d0000]">Star Cosmetics</h3>
            <p className="text-gray-600 mb-4">Luxury beauty products crafted with care.</p>
            <div className="flex gap-3">
              <Link
                href="https://facebook.com/stiscosmetics"
                className="p-2 bg-[#ff4d4d]/10 rounded-full hover:bg-[#ff4d4d]/20"
                aria-label="Facebook"
              >
                <Facebook size={18} className="text-[#990000]" />
              </Link>
              <Link
                href="https://twitter.com/stiscosmetics"
                className="p-2 bg-[#ff4d4d]/10 rounded-full hover:bg-[#ff4d4d]/20"
                aria-label="Twitter"
              >
                <Twitter size={18} className="text-[#990000]" />
              </Link>
              <Link
                href="https://instagram.com/stiscosmetics"
                className="p-2 bg-[#ff4d4d]/10 rounded-full hover:bg-[#ff4d4d]/20"
                aria-label="Instagram"
              >
                <Instagram size={18} className="text-[#990000]" />
              </Link>
              <Link
                href="https://youtube.com/stiscosmetics"
                className="p-2 bg-[#ff4d4d]/10 rounded-full hover:bg-[#ff4d4d]/20"
                aria-label="YouTube"
              >
                <Youtube size={18} className="text-[#990000]" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4 text-[#4d0000]">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/featured" className="text-gray-600 hover:text-[#ff4d4d]">
                  Featured
                </Link>
              </li>
              <li>
                <Link href="/products/best-sellers" className="text-gray-600 hover:text-[#ff4d4d]">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4 text-[#4d0000]">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#ff4d4d]">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-gray-600 hover:text-[#ff4d4d]">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="text-gray-600 hover:text-[#ff4d4d]">
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4 text-[#4d0000]">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about/our-story" className="text-gray-600 hover:text-[#ff4d4d]">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/about/sustainability" className="text-gray-600 hover:text-[#ff4d4d]">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/about/careers" className="text-gray-600 hover:text-[#ff4d4d]">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
          <p>© 2025 Star Cosmetics. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/privacy-policy" className="hover:text-[#ff4d4d]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#ff4d4d]">
              Terms
            </Link>
            <Link href="/accessibility" className="hover:text-[#ff4d4d]">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}