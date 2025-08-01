'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/db/prisma"
import { cartItemSchema } from "@/lib/validators"
import { randomUUID } from "crypto"
import type { CartItem } from "@/types"
import { cookies } from "next/headers"
import { convertToPlainObject, round2 } from "@/lib/utils"
import { revalidatePath } from "next/cache"




// 1. Calculate cart totals
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  )
  const shippingPrice = round2(itemsPrice <= 100 ? 0 : 5)
  const taxPrice = round2(itemsPrice * 0.08)
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  }
}

// 2. Add item to cart
export async function addItemToCart(input: CartItem) {
  const data = cartItemSchema.parse(input);

  // 2.1 Fetch product and validate
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
    select: { id: true, price: true, stock: true },
  });

  if (!product) throw new Error("Product not found");

  // 3. Auth or Guest Session Handling
  const session = await getServerSession(authOptions);
  const userId: string | undefined = session?.user?.id;
  const cookieStore = await cookies();
  let sessionCartId = cookieStore.get("sessionCartId")?.value;

  if (!userId && !sessionCartId) {
    sessionCartId = randomUUID();
    cookieStore.set("sessionCartId", sessionCartId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  }

  const sessionCartIdToUse = sessionCartId ?? randomUUID();

  // 🛡 4. Check user existence if logged in
  if (userId) {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      console.warn("⚠️ Tried to create cart with non-existent user ID:", userId);
      return {
        success: false,
        message: "Invalid user session. Please sign in again.",
      };
    }
  }

  // 5. Upsert Cart
  let cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId: sessionCartIdToUse },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: userId ?? null,
        sessionCartId: sessionCartIdToUse,
        items: [],
        itemsPrice: 0,
        totalPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
      },
    });
  }

  
  // 🔄 5. Merge items (and check stock)
const existingItems = cart.items as CartItem[];
const index = existingItems.findIndex(
  (item) =>
    item.productId === data.productId && item.variant === data.variant
);

// 🔍 Calculate intended total qty
const currentQty = index !== -1 ? existingItems[index].qty : 0;
const intendedQty = currentQty + 1;

if (intendedQty > product.stock) {
  return {
    success: false,
    message: `Only ${product.stock} in stock. You've reached the limit.`,
  };
}

// ✅ Add item
if (index !== -1) {
  existingItems[index].qty += 1;
} else {
  existingItems.push({
    ...data,
    price: product.price.toString(), // server-verified price
  });
}
  // console.log("🛒 Cart Items Before Price Calc:", existingItems)

  // 6. Recalculate totals
  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(existingItems)

  // 7. Update cart in DB
  await prisma.cart.update({
    where: { id: cart.id },
    data: {
      items: existingItems,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    },
  })
  revalidatePath(`/product/${data.slug}`)

  console.log({
    "🟢 User ID": userId,
    "🟡 Guest sessionCartId": sessionCartId,
    "📦 Item Added": data,
  })

  // 8. Return updated cart
  const freshCart = await getCart()
  return {
    success: true,
    message: `${data.name} ${existingItems[index] ? "updated" : "added"} to cart`,
    // description: existingItems[index]
    //   ? `${data.name} quantity was updated in your cart.`
    //   : `${data.name} has been added to your cart. You can view or checkout now.`,
    cart: freshCart,
  }
}

// 3. Get current cart
export async function getCart() {
  const session = await getServerSession(authOptions)
  const userId: string | undefined = session?.user?.id
  let sessionCartId: string | undefined

  if (!userId) {
    const cookieStore = await cookies()
    sessionCartId = cookieStore.get("sessionCartId")?.value
  }

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  })

  if (!cart) return null

   // 🛒 Enrich each cart item with current stock from DB
   const enrichedItems = await Promise.all(
    (cart.items as CartItem[]).map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { stock: true },
      });

      return {
        ...item,
        stock: product?.stock ?? 0, // default to 0 if product not found
      };
    })
  );

  return convertToPlainObject({
    ...cart,
    items: enrichedItems,
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  })
}

export async function removeItemFromCart(productId: string, variant?: string | null) {
  const session = await getServerSession(authOptions)
  let userId: string | undefined
  let sessionCartId: string | undefined

  if (session?.user?.id) {
    userId = session.user.id
  } else {
    const cookieStore = await cookies()
    sessionCartId = cookieStore.get("sessionCartId")?.value
  }

  const cart = await prisma.cart.findFirst({
    where: userId
      ? { userId }
      : { sessionCartId },
  })

  if (!cart) {
    throw new Error("Cart not found")
  }


    // Grab the item before it's removed
    const removedItem = (cart.items as CartItem[]).find(
      item => item.productId === productId && (!variant || item.variant === variant)
    )

  // Filter out the item by productId and (optionally) variant
  const updatedItems = (cart.items as CartItem[]).map(item => {
    if (item.productId === productId && (!variant || item.variant === variant)) {
      return { ...item, qty: item.qty - 1 }
    }
    return item
  }).filter(item => item.qty > 0)

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(updatedItems)

  await prisma.cart.update({
    where: { id: cart.id },
    data: {
      items: updatedItems,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    },
  })

  if (removedItem) {
    revalidatePath(`/product/${removedItem.slug}`)
  }

  return {
    success: true,
    message: removedItem
     ? `${removedItem.name} was removed from cart`
     : "Item was removed from cart",
    cart: convertToPlainObject({
      ...cart,
      items: updatedItems,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    }),
  }
}
