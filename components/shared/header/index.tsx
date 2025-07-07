"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
// import { Menu, X} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import MenuSheet from "./menu";
import { useTheme } from "next-themes";

export default function Header() {
  const { theme, systemTheme } = useTheme()
  // const {isOpen, setIsOpen} = useState(false)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null
  const currentTheme = theme === 'system' ? systemTheme : theme
  const logoSrc = currentTheme === 'dark'
    ? '/images/fwhtlogo.png' // 👈 replace with your dark logo
    : '/images/logo.png'      // 👈 light/default logo

  return (
    <header className=" bg-secondary shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link
          href="/"
          className="cursor-pointer"
        >
          <Image
            src={logoSrc}
            alt={`${APP_NAME} logo`}
            width={140}
            height={140}
            className="mr-2"
            priority
            unoptimized
            style={{ display: "block" }} // avoid inline invisibility
          />

       
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link
            href="/products"
            className=" hover:text-black transition"
          >
            Products
          </Link>
          <Link
            href="/about"
            className=" hover:text-black transition"
          >
            About
          </Link>
          <Link
            href="/contact"
            className=" hover:text-black transition"
          >
            Contact
          </Link>
        </nav>

        {/* Icons */}
       
        <MenuSheet />
        
     

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