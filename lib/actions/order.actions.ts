'use server'

import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getCart } from "./cart.actions"
import { getUserById } from "./user.actions"
import { insertOrderSchema } from "../validators"
import { prisma } from "@/db/prisma"
import { convertToPlainObject } from "../utils"
import {  PaymentResult } from "@/types"
import { paypal } from "../paypal"
import { revalidatePath } from "next/cache"
import { formatError } from "../serverUtils"

export async function createOrder() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/signin")

  const cart = await getCart()
  const userId = session?.user?.id

  if (!cart || cart.items.length === 0) redirect("/cart")
  const user = await getUserById(userId!)
  if (!user.address) redirect("/shipping-address")
  if (!user.paymentMethod) redirect("/payment-method")

  const orderData = insertOrderSchema.parse({
    userId,
    shippingAddress: user.address,
    paymentMethod: user.paymentMethod,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice,
  })

  const insertedOrderId = await prisma.$transaction(async (tx) => {
    const insertedOrder = await tx.order.create({ data: orderData })

    await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      cart.items.map(({ stock, ...item }) =>
        tx.orderItem.create({
          data: {
            ...item,
            orderId: insertedOrder.id,
            price: item.price,
          },
        })
      )
    )

    await tx.cart.update({
      where: { id: cart.id },
      data: {
        items: [],
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
      },
    })

    return insertedOrder.id
  })

  redirect(`/order/${insertedOrderId}`)
}


// Get order by id

export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: {select: {name: true, email: true } },
    }
  })

  return convertToPlainObject(data)
}


// Create new paypal order
export async function createPayPalOrder(orderId: string) {
    try {
      // Get order from database
      const order = await prisma.order.findFirst({
        where:{
          id: orderId
        }
      })
      if (order) {
       // Create paypal order
       const paypalOrder = await paypal.createOrder(Number(order.totalPrice))

       // Update order with paypal order id
       await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
          id: paypalOrder.id,
          email_address: '',
          status: '',
          pricePaid: 0
          }
         }
       })
       return { success: true, message: 'Order created successfully', data: paypalOrder.id }
      }else {
        throw new Error('Order not found')
      }
    } catch (error) {
      return { success: false, message: formatError(error) }
    }
}

// Approve paypal order and update to paid

export async function approvePayPalOrder(
  orderId: string, 
  data: {orderID: string}
) {
  try {
    // Get order from database
    const order = await prisma.order.findFirst({
      where:{
        id: orderId
      }
    })
    if(!order) throw new Error('Order not found')

    const captureData = await paypal.capturePayment(data.orderID)
    if(!captureData || captureData.id !== (order.paymentResult as PaymentResult)?.id || captureData.status !== 'COMPLETED') {
    throw new Error('Error in PayPal payment')
}
 // Update order to paid
await updateOrderToPaid({ 
  orderId ,
  paymentResult: {
    id: captureData.id,
    status: captureData.status,
    email_address: captureData.payer.email_address,
    pricePaid: captureData.purchase_units[0]?.payments?.captures[0]?.amount.value
  }
})

 revalidatePath(`/order/${orderId}`)
 return { success: true, message: 'Your order has been paid' }
  } catch (error) {
   return { success: false, message: formatError(error) } 
  }

}

// Update order to paid
async function updateOrderToPaid({
  orderId,
  paymentResult
}: {
  orderId: string
  paymentResult?: PaymentResult
}) { 
   // Get order from database
   const order = await prisma.order.findFirst({
    where:{
      id: orderId
    },
    include: {
      orderitems: true
    }
  })

  if(!order) throw new Error('Order not found')
  if (order.isPaid) throw new Error('Order is already paid')

  // Transaction to update order and account for product stock
  await prisma.$transaction(async (tx) => {
    // Iterate over products and update stock
    for (const item of order.orderitems) {
      await tx.product.update({
        where: {
          id: item.productId
        },
        data: {
          stock: {
            increment: -item.qty } },
      })
    }

    // Set the order to paid
    await tx.order.update({
      where: {
        id: orderId
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult
      }
    })
  })
  
  // Get updated order after transaction
  const updateOrder = await prisma.order.findFirst({
    where: {
      id: orderId
    },
    include: {
      orderitems: true,
      user: {select: {name: true, email: true } }
    }
  })

  if (!updateOrder) throw new Error('Order not found')
}