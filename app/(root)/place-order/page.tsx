import CheckoutSteps from "@/components/shared/checkout-steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { Metadata } from "next"
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import PlaceOrderForm from "./place-order-form";

export const metadata: Metadata = {
  title: "Place Order",
}

export default async function PlaceOrderPage() {
  const cart = await getCart();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");
  
  const user = await getUserById(userId);

  if (!cart || cart.items.length === 0) redirect("/cart");
  if (!user.address) redirect("/shipping-address");
  if (!user.paymentMethod) redirect("/payment-method");

  const userAddress = user.address as ShippingAddress
  

  return (
  <div className="wrapper mt-5">
    <CheckoutSteps current={3} />
      <h1 className="py-4 text-2xl">Place Order</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
         <div className="md:col-span-2 overflow-x-auto space-y-4">
           <Card>
             <CardContent>
                <h2 className="text-xl pb-4">Shipping Address</h2>
                <p>{userAddress.fullName}</p>
                <p>{userAddress.streetAddress}, {userAddress.city}{' '}
                {userAddress.country}, {userAddress.postalCode}{' '}</p>
                <div className="mt-3">
                  <Link href='/shipping-address'>
                    <Button variant="outline">Edit</Button>
                 </Link>
                </div> 
             </CardContent>
           </Card>

           <Card>
             <CardContent>
                <h2 className="text-xl pb-4">Payment Method</h2>
                <p>{user.paymentMethod}</p>
                <div className="mt-3">
                  <Link href='/payment-method'>
                    <Button variant="outline">Edit</Button>
                 </Link>
                </div> 
             </CardContent>
           </Card>

           <Card>
             <CardContent>
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
                  {cart.items.map((item) => (
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
                <div>{formatCurrency(cart.itemsPrice)}</div>
              </div>

              <div className="flex justify-between">
                <div>Tax</div>
                <div>{formatCurrency(cart.taxPrice)}</div>
              </div>

              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{formatCurrency(cart.shippingPrice)}</div>
              </div>

              <div className="flex justify-between">
                <div>Total</div>
                <div>{formatCurrency(cart.totalPrice)}</div>
              </div>
                <PlaceOrderForm /> 
            </CardContent>
          </Card>
         
         </div>
      
      </div>
  </div>
  )
}