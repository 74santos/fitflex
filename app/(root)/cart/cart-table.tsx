'use client'

import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { addItemToCart, removeItemFromCart,  } from "@/lib/actions/cart.actions";
import {ArrowRight, Loader, Minus, Plus} from "lucide-react";
import { Cart} from "@/types"
import Link from "next/link";
import Image from "next/image";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {formatCurrency} from "@/lib/utils";
import {Card, CardContent} from "@/components/ui/card";


export default function CartTable({cart}: {cart?: Cart}) {
  
  const [isPending, startTransition] = useTransition();
  const router = useRouter();


  return (
    <div>
      <h1 className="py-4 font-bold text-2xl">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div> Cart is empty. <Link href="/">Shop Now</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
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
                  <Link href={`/product/${item.slug}`} className='flex iems-center'>
                  <Image 
                  src={item.image} 
                  alt={item.name} 
                  width={80} 
                  height={80} 
                  unoptimized
                  />
                  <span className="px-2 items-center my-auto">{item.name}</span>
                  </Link>
                </TableCell>
                <TableCell className='flex justify-center items-center  gap-2'>
                  <Button disabled={isPending} variant='outline' type='button'
                  onClick={() => startTransition(async () => {
                    const res = await removeItemFromCart(item.productId);

                    document.dispatchEvent(new Event("cart-updated"))
                    if (!res.success) {
                      toast(res.message)
                    }                    
                  }) }>
                    {isPending  ? (<Loader className="animate-spin h-4 w-4" />) : (<Minus className='h-4 w-4' />)}

                  </Button>
                  <span>{item.qty}</span>

                  <Button disabled={isPending || item.qty >= (item.stock ?? 0)} variant='outline' type='button'
                  title={
                    item.qty >= (item.stock ?? 0)
                      ? "You’ve reached the maximum available stock"
                      : ""
                  }
                  onClick={() => startTransition(async () => {
                    const res = await addItemToCart({
                      ...item,
                      qty:1,
                    });

                    document.dispatchEvent(new Event("cart-updated"))
                    if (!res.success) {
                      toast(res.message)
                    }                    
                  }) }
                  
                  
                  >
                    {isPending  ? (<Loader className="animate-spin h-4 w-4" />) : (<Plus className='h-4 w-4' />)}

                  </Button>

                </TableCell>
                <TableCell className='text-right'>${item.price}</TableCell>
               </TableRow>
             ))}
            </TableBody>

           </Table>
          </div>

          <Card>
            <CardContent className='p-4 gap-3'>
              <div className="pb-5 text-xl">
                Subtotal ({cart.items.reduce((a,b) => a + b.qty, 0)}):
                <span className='font-bold'> {formatCurrency(cart.itemsPrice)}</span>
              </div>
              <Button className="w-full" disabled={isPending} onClick={ () => {
               startTransition(() => router.push("/shipping-address"))  }
              }>
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin"/>
                ) : (
                  <ArrowRight className="w-4 h-4"/>
                )}{' '}
                Proceed to Checkout
              </Button>
            </CardContent> 
          </Card>
        </div>
      ) }
      </div>
  )
}