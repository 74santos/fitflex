"use client"

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils"
import { Order } from "@/types"
import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import { PayPalScriptProvider, PayPalButtons , usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { createPayPalOrder, approvePayPalOrder, updatedOrderToPaidCOD, deliverOrder} from "@/lib/actions/order.actions";
import { toast } from "sonner";
import StripePayment from "./stripe-payment";



export default function OrderDetailsTable({ 
  order,
  paypalClientId, 
  isAdmin, 
  stripeClientSecret 
}: { 
  order: Order; 
  paypalClientId: string; 
  isAdmin: boolean;  
  stripeClientSecret: string | null
}) {
  const {
    id,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt
  } = order;

  // PayPal script reducer it is used to get the status of the PayPal script
  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer()
   let status = '';

   if(isPending) {
    status = 'Loading PayPal...'
   } else if(isRejected) {
    status = 'Error loading PayPal'
   }
   return status
  }

  // Create PayPal order
  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id)
    
    if(!res.success) {
      toast.error(res.message)

    }

    return res.data
  }

// Approve PayPal order
   const handleApprovePayPalOrder = async (data:{orderID: string}) => {
    const res = await approvePayPalOrder(order.id, data)
   toast(res.message)
    
  }

  // Button to mark order as paid
  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();
    return (
      <Button 
      type="button"
      onClick={() => startTransition( async () => {
      const res = await updatedOrderToPaidCOD(order.id)

      if(res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
      })} 
      disabled={isPending} 
      >
        {isPending ? "Marking as paid..." : "Mark as paid"}
      </Button>
    )
  }

// Button to mark order as delivered
   const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();
    return (
      <Button 
      type="button"
      onClick={() => startTransition( async () => {
      const res = await deliverOrder(order.id)

      if(res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
      })} 
      disabled={isPending} 
      >
        {isPending ? "processing..." : "Mark as delivered"}
      </Button>
    )
  }






  return (
   <div className="wrapper">
      <h1 className="py-4 text-2xl">Order {formatId(id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-4-y overflow-x-auto">
          <Card  className='mb-4'>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{paymentMethod}</p>
              { isPaid ? (
                <Badge variant='secondary'>
                  Paid at { formatDateTime(paidAt!).dateTime }
                </Badge>
              ) : (
                <Badge variant='destructive'>
                  Not Paid
                </Badge>
              ) }
            </CardContent>
          </Card>

          <Card className='mb-4'>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
               <p> {shippingAddress.streetAddress}, {shippingAddress.city},
              {' '}{shippingAddress.postalCode}, {shippingAddress.country}
               </p>
              { isDelivered ? (
                <Badge variant='secondary'>
                 Delivered at { formatDateTime(deliveredAt!).dateTime }
                </Badge>
              ) : (
                <Badge variant='destructive'>
                  Not Delivered
                </Badge>
              ) }
            </CardContent>
          </Card>

          <Card className='mb-4'>
            <CardContent className="p-4 gap-4">
            <h2 className="text-xl pb-4">Order Items</h2>
          
            <Table>
                <TableHeader>
                  <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className='text-center' >Quantity</TableHead>
                  <TableHead className='text-right' >Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link href={`/product/${item.slug}`} className='flex items-center'>
                          <Image src={item.image} alt={item.name} width={50} height={50} unoptimized />
                         <span className="px-2">{item.name}</span> 
                        </Link>
                      </TableCell>
                      <TableCell className='text-center'>{item.qty}</TableCell>
                      <TableCell className='text-right'>${item.price}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
              </Table>

            </CardContent>
          </Card>

        </div>

          <div>
                  <Card>
                    <CardContent className="p-4 gap-4 space-y-4">
                      <div className="flex justify-between">
                        <div>Items</div>
                        <div>{formatCurrency(itemsPrice)}</div>
                      </div>
        
                      <div className="flex justify-between">
                        <div>Tax</div>
                        <div>{formatCurrency(taxPrice)}</div>
                      </div>
        
                      <div className="flex justify-between">
                        <div>Shipping</div>
                        <div>{formatCurrency(shippingPrice)}</div>
                      </div>
        
                      <div className="flex justify-between">
                        <div>Total</div>
                        <div>{formatCurrency(totalPrice)}</div>
                      </div>
                       {/* PayPal Payment */}
                        {!isPaid && paymentMethod === 'PayPal' && (
                          <div>
                            <PayPalScriptProvider options={{clientId: paypalClientId}}> 
                              <PrintLoadingState />
                            <PayPalButtons 
                                createOrder={handleCreatePayPalOrder} 
                                onApprove={handleApprovePayPalOrder} 
                                />
                          </PayPalScriptProvider> 
                          </div>
                        )}

                      {/* Stripe Payment*/}
                        {
                          !isPaid && paymentMethod === 'Stripe' && stripeClientSecret && (
                            <StripePayment
                              priceInCents={Number(order.totalPrice) * 100}
                              orderId={order.id}  
                              clientSecret={stripeClientSecret}                      
                                />
                          )
                        }


                      {/* Cash on Delivery */}
                      {
                        isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
                          <MarkAsPaidButton/>
                        )
                      }
                        {
                        isAdmin && isPaid && !isDelivered && (
                          <MarkAsDeliveredButton/>
                        )
                      }
                      
                    </CardContent>
                  </Card>
                 
                 </div>



      </div>
    </div>
  )
}


//  <div className="space-y-4">
//       <h2 className="text-xl font-semibold mb-2">Order Items</h2>
//       <div className="border rounded p-4 space-y-4">
//         {items.map((item) => (
//           <div key={item.productId} className="flex items-center justify-between gap-4 text-sm">
//             <div className="flex items-center gap-4">
//               <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
//               <div>
//                 <p className="font-medium">{item.name}</p>
//                 <p className="text-muted-foreground">Qty: {item.qty}</p>
//               </div>
//             </div>
//             <p className="text-right">{formatCurrency(item.price)}</p>
//           </div>
//         ))}
//       </div>
//     </div>