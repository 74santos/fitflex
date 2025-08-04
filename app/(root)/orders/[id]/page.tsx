import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getOrderById } from "@/lib/actions/order.actions"
import type { Order, ShippingAddress } from "@/types"
import OrderDetailsTable from "./order-details-table"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import  Stripe  from "stripe"

export const metadata: Metadata = {
  title: "Order Details",
}

export default async function OrderDetailsPage(props: { params: Promise<{ id: string }> }) {
  // Await params if it's a Promise
  const params = await props.params

  const order = await getOrderById(params.id)
  if (!order) return notFound();

  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  let client_secret = null

  // Check if is not paid  and using stripe
  if(order.paymentMethod === 'Stripe' && !order.isPaid) {
    // Init stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'USD',
      metadata: { orderId: order.id}
    })
      client_secret = paymentIntent.client_secret
  }

  const address = order.shippingAddress as ShippingAddress;

  type OrderDetails = Omit<Order, "paymentResult"> & { userId?: string };

  

  return (
    <OrderDetailsTable
      order={{ ...order, shippingAddress: address } as OrderDetails}
      stripeClientSecret={client_secret}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      isAdmin={ session?.user?.role === 'admin' || false }
    />
  );
}










