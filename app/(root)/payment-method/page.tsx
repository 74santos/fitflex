import { Metadata } from "next"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/actions/user.actions";
import PaymentMethodForm from "./payment-method-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
  title: "Select Payment Method",
};


export default async function PaymentMethodPage() {
  const session =  await getServerSession(authOptions)
  const userId = session?.user?.id

  if(!userId) throw new Error("User not found");
  const user = await getUserById(userId);


  return (
    <div className='wrapper mt-6'>
         <CheckoutSteps current={2} />
      <PaymentMethodForm preferedPaymentMethod={user.paymentMethod ?? ''} />
    </div>
  )
}

