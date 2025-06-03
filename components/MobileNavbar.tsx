"use client";

import { Home, ShoppingBag, ShoppingCart, Heart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWishlistStore } from "@/lib/modules/wishlist/wishlist.store";
import { useCartStore } from "@/lib/modules/cart/cart.store";

export default function MobileNav() {
  const pathname = usePathname();
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const cartCount = useCartStore((state) => state.cart?.items.length || 0);

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/products", icon: ShoppingBag, label: "Shop" },
    { href: "/cart", icon: ShoppingCart, label: "Cart", count: cartCount },
    { href: "/wishlist", icon: Heart, label: "Wishlist", count: wishlistCount },
    { href: "/account", icon: User, label: "Account" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/products" && pathname.startsWith("/products/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center p-2 ${isActive ? "text-[#ff4d4d]" : "text-[#990000]"}`}
              aria-label={item.label}
            >
              <div className="relative">
                <item.icon className="h-6 w-6" />
                {item.count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ff4d4d] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}