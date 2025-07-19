// lib/prisma.ts

import {  neonConfig } from '@neondatabase/serverless';
import { PrismaNeon} from '@prisma/adapter-neon';
import { PrismaClient } from '@/lib/generated/prisma'; // assuming this is your generated client path
import ws from 'ws';

// ✅ Required for Neon serverless with WebSocket
neonConfig.webSocketConstructor = ws;

// ✅ Ensure env is loaded
import dotenv from 'dotenv';
dotenv.config(); // For safety if run from CLI

// ✅ Connection string
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('❌ DATABASE_URL is not defined in .env');
}

console.log('✅ Loaded DATABASE_URL:', connectionString);

// ✅ Set up Neon pool + adapter

const adapter = new PrismaNeon({connectionString});

// ✅ Export PrismaClient with adapter
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price?.toString?.();
        },
      },
      rating: {
        compute(product) {
          return product.rating?.toString?.();
        },
      },
    },
    cart: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString()
        }
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(cart) {
          return cart.shippingPrice.toString()
        }
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(cart) {
          return cart.taxPrice.toString()
        }
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(cart) {
          return cart.totalPrice.toString()
        }
      },    
    },
    order: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString()
        }
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(cart) {
          return cart.shippingPrice.toString()
        }
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(cart) {
          return cart.taxPrice.toString()
        }
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(cart) {
          return cart.totalPrice.toString()
        }
      },    
    },
    orderItem: {
      price: {
        compute(cart) {
          return cart.price?.toString();
        },
      },
    },
  },
});
