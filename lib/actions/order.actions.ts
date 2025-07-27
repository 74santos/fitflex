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
import { PAGE_SIZE } from "../constants"
import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '../generated/prisma';

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

  redirect(`/orders/${insertedOrderId}`)
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

 revalidatePath(`/orders/${orderId}`)
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

// Get user's order
export async function getMyOrders({
  limit = PAGE_SIZE,
  page
}: { 
  limit?: number; 
  page: number 
}) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('User is not authorized')

  const data = await prisma.order.findMany({
    where: { userId: session?.user?.id },
    take: limit,
    skip: (page - 1) * limit,
    orderBy: { createdAt: 'desc' }
  })

  const dataCount = await prisma.order.count({
    where: { userId: session?.user?.id }
  })

  return {
    data,
    totalPages: Math.ceil(dataCount / limit)
  }

}

type SalesDataType = {
  month: string;
  totalSales: number;
}[];

// Get sales data and order summary
export async function getOrderSummary() {
  //Get counts for each resource
  const ordersCount = await prisma.order.count()
  const productsCount = await prisma.product.count()
  const usersCount = await prisma.user.count()

  //Calculate the total sales
  const totalSales = await prisma.order.aggregate({
    _sum: {
      totalPrice: true
    }
  })
  // Get monthly sales
  const salesDataRaw = await prisma.$queryRaw<Array<{
    month: string;
    totalSales: Decimal;
  }>>
    `SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales"
     FROM "Order"
     GROUP BY to_char("createdAt", 'MM/YY')`

  const salesData:SalesDataType = salesDataRaw.map((entry) => ({
      month: entry.month,
      totalSales: Number(entry.totalSales)
    
  }))
  
  // Get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {select: {name:true}}
    },
    take: 6
  })

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    salesData,
    latestSales
  }
}


// Get all orders
export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
  query
}:{
  limit?: number;
  page: number;
  query: string
}) {

  const queryFilter: Prisma.OrderWhereInput = query && query !== 'all' ? {
    user: {
      name: {
        contains: query,
        mode: 'insensitive'
      } 
    }
  } : {}

  const data = await prisma.order.findMany({
    where:  {
      ...queryFilter,
    },
    take: limit,
    skip: (page - 1) * limit,
    orderBy: { createdAt: 'desc' },
    include: { user: {select:{name:true}} }
  })

  const dataCount = await prisma.order.count({
    where: queryFilter,
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit)
  }
}

// Delete an order
export async function deleteOrder(id: string) {
 try {
  await prisma.order.delete({
    where: {
      id
    }
  })
  revalidatePath('/admin/orders')
  return { success: true, message: 'Order deleted successfully' }

 } catch (error) {
  return { success: false, message: formatError(error) }
 }
}

// Update COD order to paid

export async function updatedOrderToPaidCOD(orderId:string) {
  try {
    await updateOrderToPaid({orderId})

    revalidatePath(`/orders/${orderId}`)
    return { success: true, message: 'Order marked as paid' }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}


// Update COD order to delivered
export async function deliverOrder(orderId:string ) {

  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId
      }
    })
     if(!order) throw new Error('Order not found')
     if(!order.isPaid) throw new Error('Order is not paid')

     await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        isDelivered: true,
        deliveredAt: new Date()
      }
     })
     revalidatePath(`/orders/${orderId}`)
     return { success: true, message: 'Order has been marked as delivered' }

  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}