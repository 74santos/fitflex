import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getOrderById } from "@/lib/actions/order.actions"
// import { formatCurrency } from "@/lib/utils"
import type { Order, ShippingAddress } from "@/types"
import OrderDetailsTable from "./order-details-table"

export const metadata: Metadata = {
  title: "Order Details",
}

export default async function OrderDetailsPage( props: {
  params: Promise<{
    id: string
  }>
}) {

  const {id} = await props.params
  
  const order = await getOrderById(id)

  if (!order) notFound()

  

  const address = order.shippingAddress as ShippingAddress

  return (
  
    <OrderDetailsTable order={{
      ...order,
      shippingAddress: address
    } as Order} 
    paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
    
    />
  
  )
}




// <div className="wrapper mt-5 space-y-6">
// <h1 className="text-2xl font-bold">Order #{order.id}</h1>

// {/* Order Status & Shipping Info */}
// <div className="grid md:grid-cols-2 gap-6">
//   <div className="space-y-2">
//     <p><strong>Status:</strong> {order.isPaid ? "✅ Paid" : "❌ Not Paid"}</p>
//     <p><strong>Delivered:</strong> {order.isDelivered ? "✅ Yes" : "❌ No"}</p>
//     <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
//   </div>

//   <div>
//     <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
//     <div className="bg-muted p-4 rounded space-y-1 text-sm leading-relaxed">
//       <p>{address.fullName}</p>
//       <p>{address.streetAddress}</p>
//       <p>
//         {address.city}, {address.postalCode}
//       </p>
//       <p>{address.country}</p>
//       {address.lat && address.lng && (
//         <p className="text-muted-foreground">
//           (Lat: {address.lat}, Lng: {address.lng})
//         </p>
//       )}
//     </div>
//   </div>
// </div>

// {/* Order Items Table */}
// <OrderDetailsTable items={order.orderitems} />

// {/* Totals */}
// <div className="border-t pt-4 text-sm space-y-1">
//   <p><strong>Items:</strong> {formatCurrency(order.itemsPrice)}</p>
//   <p><strong>Shipping:</strong> {formatCurrency(order.shippingPrice)}</p>
//   <p><strong>Tax:</strong> {formatCurrency(order.taxPrice)}</p>
//   <p className="text-lg font-bold"><strong>Total:</strong> {formatCurrency(order.totalPrice)}</p>
// </div>
// </div>









// export default async function OrderDetailsPage({ 
//   params 
// }: { 
//   params: { id: string } 
// }) {
//   const order = await getOrderById(params.id)

//   if (!order) notFound()

  

//   const address = order.shippingAddress as ShippingAddress

//   return (
  
//     <OrderDetailsTable order={{
//       ...order,
//       shippingAddress: address
//     } as Order} />
  
//   )
// }