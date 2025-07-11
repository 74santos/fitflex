// app/api/cart/route.ts
import { getCart } from "@/lib/actions/cart.actions"
import { NextResponse } from "next/server"

export async function GET() {
  const cart = await getCart()
  return NextResponse.json(cart || { items: [] })
}
