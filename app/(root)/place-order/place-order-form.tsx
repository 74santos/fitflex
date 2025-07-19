'use client'

import { Check, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"
import { createOrder } from "@/lib/actions/order.actions"

function PlaceOrderButton() {
  const { pending } = useFormStatus()

  return (
    <Button formAction={createOrder} disabled={pending} className="w-full">
      {pending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Check className="h-4 w-4" />
      )}
      {' '}Place Order
    </Button>
  )
}

export default function PlaceOrderForm() {
  return (
    <form className="w-full">
      <PlaceOrderButton />
    </form>
  )
}
