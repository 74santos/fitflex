// components/footer/index.tsx
'use client';

import Link from 'next/link';
import { FacebookIcon, InstagramIcon, TwitterIcon } from 'lucide-react';
import {APP_NAME} from "@/lib/constants";

import Image from "next/image";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 px-6 py-10 mt-12 border-t">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[500px_repeat(3,1fr)] gap-12">
        
        {/* Brand / About */}
        <div >
     
        <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900 font-inter">
          <Image
            src="/images/fwhtlogo.png"
            alt={`${APP_NAME} logo`}
            width={120}
            height={120}
            className="my-2"
            priority
          unoptimized
            style={{ display: "block" }} // avoid inline invisibility
          />

          {/* <img 
  src="/images/fitflexlogo.png" 
  alt={`${APP_NAME} logo`}
  width="120" 
  height="120" 
  className="mr-2" 
/> */}
        </Link>




          <p className="text-sm">
            FitFlex is your destination for premium home gym gear and supplements designed for real results.
          </p>
        </div>
 

        {/* Quick Links */}
        <div>
          <h3 className="text-md font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/products" className="hover:underline">Products</Link></li>
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-md font-semibold mb-2">Support</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/login" className="hover:underline">Account Login</Link></li>
            <li><Link href="/cart" className="hover:underline">Shopping Cart</Link></li>
            <li><Link href="/returns" className="hover:underline">Returns</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-md font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
          <a href="#" aria-label="Facebook" className="hover:text-blue-600">
    <FacebookIcon className="h-5 w-5" />
  </a>
  <a href="#" aria-label="Instagram" className="hover:text-pink-500">
    <InstagramIcon className="h-5 w-5" />
  </a>
  <a href="#" aria-label="Twitter" className="hover:text-blue-400">
    <TwitterIcon className="h-5 w-5" />
  </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-gray-500 pt-4 text-center text-sm text-gray-500">
        &copy; {currentYear} {APP_NAME} . All rights reserved.
      </div>
    </footer>
  );
}
