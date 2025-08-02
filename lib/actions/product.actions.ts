'use server';

import { Prisma } from '../generated/prisma';

import { prisma } from '@/db/prisma';
import { convertToPlainObject } from '../utils';
import {LATEST_PRODUCTS_LIMIT, PAGE_SIZE} from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from '../validators';
import { formatError } from '../serverUtils';
import z from 'zod';
import { revalidatePath } from 'next/cache';

//Get latest products

export async function getLatestProducts() {
  // const prisma = new PrismaClient();

  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });
  return convertToPlainObject(data);
}

// Get single product by it's slug

export async function getProductBySlug(slug: string) {
 return await prisma.product.findFirst({
    where: { slug: slug },
  });
  
}

//Get single product by it's id
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
     where: { id: productId },
   });
   return convertToPlainObject(data);
 }


// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  const where: Prisma.ProductWhereInput = {
    ...(query && {
      name: {
        contains: query,
        mode: "insensitive", // ensures case-insensitive comparison
      },
    }),
    ...(category && category !== "all" && {
      category: {
        equals: category,
        mode: "insensitive",
      },
    }),
    ...(
      price &&
      price !== "all" &&
      price.includes("-") &&
      (() => {
        const [min, max] = price.split("-").map(Number);
        return {
          price: { gte: min, lte: max },
        };
      })()
    ),
    ...(rating && rating !== "all" && !isNaN(+rating) && {
      rating: { gte: Number(rating) },
    }),
  };
  

  const data = await prisma.product.findMany({
    where,
    orderBy: 
      sort === 'lowest'
        ? { price: 'asc' }
        : sort === 'highest'
        ? { price: 'desc' }
        : sort === 'rating'
        ? { rating: 'desc' }
        : { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count({ where });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}



// Delete a product
export async function deleteProduct(id: string) {
  try {
   const productExist = await prisma.product.findFirst({
      where: { id }
    })

    if(!productExist) throw new Error('Product not found')

    await prisma.product.delete({ where: { id }})

    revalidatePath('/admin/products')
    return { success: true, message: 'Product deleted successfully' }

   } catch (error) {
    return { success: false, message: formatError(error) }
   }
}



// Create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({ data: product });

    revalidatePath('/admin/products')
    return {
      success: true,
      message: "Product created successfully"
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}



// Update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);
   const productExist = await prisma.product.findFirst({
     where: { id: product.id }
   })

   if(!productExist) throw new Error('Product not found')

    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });


    revalidatePath('/admin/products')
    return {
      success: true,
      message: "Product updated successfully"
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}

//Get all categories

export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  })

  // Make it serializable
  return data.map(({ category, _count }) => ({
    category,
    count: _count,
  }))
}


// Get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 4
  });
  return convertToPlainObject(data);
}