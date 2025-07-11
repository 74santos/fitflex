import CartTable from "./cart-table"
import { getCart } from "@/lib/actions/cart.actions"

export const metadata = {
  title: 'Shopping Cart'
}

export default async function CartPage() {
const cart = await getCart()

if (!cart) {
  return <div>Cart is empty</div>
}

  return (
    <div className="wrapper pt-4">
    <CartTable cart={cart} />  
    </div>
  )
}