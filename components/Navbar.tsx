"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle, // Import SheetTitle
} from "@/components/ui/sheet";
import { Heart, Search, ShoppingBag, User, Menu, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { productData } from "@/lib/data";

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrollY > 20 ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex-1 md:flex-none">
          <a href="#" className="text-xl font-semibold text-rose-900">
            STAR COSMETICS
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {productData.categories.map((category) => (
                      <li
                        key={category.id}
                        className="block select-none space-y-1 rounded-md p-3 hover:bg-slate-100"
                      >
                        <NavigationMenuLink asChild>
                          <a href={`#${category.id}`} className="flex gap-2 items-center">
                            <div className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center">
                              <span className="text-xs text-rose-700">{category.name[0]}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium">{category.name}</div>
                              <p className="text-xs text-slate-500">
                                Explore {category.name.toLowerCase()} products
                              </p>
                            </div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  New Arrivals
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Best Sellers
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center gap-4">
          <button className="p-2 hover:bg-rose-50 rounded-full">
            <Search size={20} />
          </button>
          <button className="p-2 hover:bg-rose-50 rounded-full">
            <User size={20} />
          </button>
          <button className="p-2 hover:bg-rose-50 rounded-full">
            <Heart size={20} />
          </button>
          <button className="p-2 hover:bg-rose-50 rounded-full">
            <ShoppingBag size={20} />
          </button>
        </div>

        {/* Mobile hamburger menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-rose-50 rounded-full">
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="right">
              {/* Add SheetTitle for accessibility */}
              <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-6 mt-10">
                <h2 className="text-lg font-medium">Menu</h2>
                <div className="flex flex-col gap-4">
                  <a
                    href="#"
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    Shop <ChevronDown size={16} />
                  </a>
                  <a
                    href="#"
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    New Arrivals
                  </a>
                  <a
                    href="#"
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    Best Sellers
                  </a>
                  <a
                    href="#"
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    About
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex justify-around p-3">
            <button className="flex flex-col items-center gap-1">
              <Search size={20} />
              <span className="text-xs">Search</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <User size={20} />
              <span className="text-xs">Account</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Heart size={20} />
              <span className="text-xs">Wishlist</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <ShoppingBag size={20} />
              <span className="text-xs">Cart</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}