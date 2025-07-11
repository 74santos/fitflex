"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import type { Cart, CartItem } from "@/types";
import { Plus, Minus, Loader } from "lucide-react";


type AddToCartProps = {
  cart: Cart | null;
  item: CartItem;
};

export default function AddToCart({ cart, item }: AddToCartProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleClick = () => {
    startTransition(() => {
      addItemToCart(item)
        .then((res) => { 

          // Trigger cart refresh in header
           document.dispatchEvent(new Event("cart-updated"))

          toast(res.message, {
            // description: res.description,
            action: {
              label: "View Cart",
              onClick: () => router.push("/cart"),
            },
          });
        })
        .catch(() => {
          toast.error("Failed to add to cart.");
        });
    });
  };

  const handleRemove = () => {
    startTransition(() => {
      removeItemFromCart(item.productId)
        .then((res) => {
          document.dispatchEvent(new Event("cart-updated"))
          toast(res.message);        
        })
        .catch(() => {
          toast.error("Failed to remove item.");
        });
    });
  };
  

// Check it item is in cart
const existItem = cart && cart.items.find((x)=> x.productId === item.productId)


return existItem ? (
  <div className="flex items-center justify-center gap-3">
    <Button
      variant="outline"
      className="min-w-[3rem] px-2"
      type="button"
      onClick={handleRemove}>
        {/* <Minus className='h-4 w-4' /> */}
      {isPending  ? (<Loader className="animate-spin h-4 w-4" />) : (<Minus className='h-4 w-4' />)}
    </Button>
    <span className="px-2">{existItem.qty}</span>
    <Button
      onClick={handleClick}
      variant="outline"
      disabled={isPending}
      className="min-w-[3rem] px-2"
      type="button"
    >
      {/* <Plus className='h-4 w-4'  /> */}
      {isPending  ? (<Loader className="animate-spin h-4 w-4" />) : ( <Plus className='h-4 w-4'  />)}
    </Button>

    
  </div>
) : (
  <Button
    onClick={handleClick}
    disabled={isPending}
    className="w-full cursor-pointer"
    type="button"
  >
    {isPending ? (
      "Adding..."
    ) : (
      <>
        <Plus className="mr-1" /> Add to Cart
      </>
    )}
  </Button>
);

}
