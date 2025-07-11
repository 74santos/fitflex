import { authOptions } from "@/lib/auth";
import { getCart } from "@/lib/actions/cart.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import {getUserById} from "@/lib/actions/user.actions";
import { getServerSession } from "next-auth";
import { ShippingAddress } from "@/types";
import ShippingAddressForm from "./shipping-address-form";

export const metadata: Metadata = {
  title: "Shipping Address",
};


export default async function ShippingAddressPage() {
  const cart = await getCart();

  if(!cart || cart.items.length === 0) redirect("/cart")

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if(!userId) throw new Error("No user ID found");
  const user = await getUserById(userId);

  return (
    <div className="wrapper my-4">
     <ShippingAddressForm  address={user.address as ShippingAddress}/>
    </div>
  );
}