'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { round2 } from "@/lib/utils";

function calcPrice(items: CartItem[]) {
  const itemsPrice = round2(items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0));
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 5);
  const taxPrice = round2(itemsPrice * 0.08);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
}

export async function mergeCartOnLogin() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return;

  const cookieStore = await cookies();
  const sessionCartId = cookieStore.get("sessionCartId")?.value;
  if (!sessionCartId) return;

  const guestCart = await prisma.cart.findUnique({
    where: { sessionCartId },
  });
  if (!guestCart || guestCart.items.length === 0) return;

  const userCart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      sessionCartId: null,
      items: [],
      itemsPrice: 0,
      totalPrice: 0,
      shippingPrice: 0,
      taxPrice: 0,
    },
  });

  const mergedItems = [...(userCart.items as CartItem[])];
  for (const guestItem of guestCart.items as CartItem[]) {
    const index = mergedItems.findIndex(
      (i) => i.productId === guestItem.productId && i.variant === guestItem.variant
    );

    if (index !== -1) {
      mergedItems[index].qty += guestItem.qty;
    } else {
      mergedItems.push(guestItem);
    }
  }

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(mergedItems);

  await prisma.cart.update({
    where: { id: userCart.id },
    data: {
      items: mergedItems,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    },
  });

  await prisma.cart.delete({ where: { id: guestCart.id } });

  // Remove the sessionCartId cookie
  cookieStore.set("sessionCartId", "", {
    path: "/",
    maxAge: 0,
  });

  console.log("✅ Guest cart merged into user cart after login");
}
