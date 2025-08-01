"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { APP_NAME } from "@/lib/constants";
import MenuSheet from "./menu";
import { useTheme } from "next-themes";
import type { CartItem } from "@/types";
import Search from "./search";
import CategoryDrawer from "./category-drawer"

export default function Header() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [cartQty, setCartQty] = useState(0);
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    setMounted(true);

    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart");
        const cart = await res.json();
        const totalQty =
          cart?.items?.reduce((sum: number, item: CartItem) => sum + item.qty, 0) || 0;
        setCartQty(totalQty);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCart();
    fetchCategories();

    const onCartUpdate = () => fetchCart();
    document.addEventListener("cart-updated", onCartUpdate);

    return () => {
      document.removeEventListener("cart-updated", onCartUpdate);
    };
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const logoSrc = currentTheme === "dark" ? "/images/fwhtlogo.png" : "/images/logo.png";

  return (
    <header className="bg-secondary shadow-sm sticky top-0 z-50">
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-4 flex items-center justify-between h-16">
        <div className="flex items-center">
          <CategoryDrawer categories={categories} />
          <Link href="/" className="cursor-pointer ml-4">
            <Image
              key={logoSrc}
              src={logoSrc}
              alt={`${APP_NAME} logo`}
              width={140}
              height={140}
              className="mr-2"
              priority
              unoptimized
              style={{ display: "block" }}
            />
          </Link>
        </div>

        <div className="hidden md:block" >
        <Search categories={categories} />
          </div> 

        <MenuSheet cartQty={cartQty} />
      </div>
    </header>
  );
}








   {/* Mobile Menu Toggle */}
        {/* <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 hover:text-black"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button> */}


{/* Mobile Navigation */}
      {/* {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col space-y-2 px-4 py-4">
            <Link href="/products" className="text-gray-700 hover:text-black">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-black">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-black">
              Contact
            </Link>
          </nav>
        </div>
      )} */}


{
  /* <span className="hidden lg:block text-2xl font-bold tracking-tight text-gray-900 font-inter">
        FitFlex
      </span> */
}
   {/* <img 
  src="/images/fitflexlogo.png" 
  alt={`${APP_NAME} logo`}
  width="120" 
  height="120" 
  className="mr-2" 
/> */}