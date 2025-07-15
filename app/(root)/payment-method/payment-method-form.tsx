'use client'

import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import { useTransition } from "react"
import { paymentMethodSchema } from "@/lib/validators"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { DEFAULT_PAYMENT_METHOD, PAYENT_METHODS } from "@/lib/constants"
import z from 'zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from '@/components/ui/button'
import { Loader, ArrowRight } from 'lucide-react'
import { updateUserPaymentMethod } from '@/lib/actions/user.actions'

export default function PaymentMethodForm({ preferedPaymentMethod }: { preferedPaymentMethod: string }) {

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferedPaymentMethod  || DEFAULT_PAYMENT_METHOD
    }
  })

  const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
    console.log("Submitted value:", values.type)
    startTransition(async () => {
      const result = await updateUserPaymentMethod(values);
      if (!result.success) {
        toast.error(result.message);
        return
      }
      router.push('/place-order')
    })
  };

  // const { isSubmitting } = form.formState
  
  return (
    <div>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold mt-4">Payment Method</h1>
        <p className="text-sm text-muted-foreground">
          Select your preferred payment method.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      {PAYENT_METHODS.map((paymentMethod) => (
                        <FormItem key={paymentMethod} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem 
                            value={paymentMethod}
                            checked={field.value === paymentMethod}/>
                          </FormControl>
                          <FormLabel className="font-normal">{paymentMethod}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

        <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4"></ArrowRight>
              )}{' '}
              Continue
            </Button>
            </div>

            
          </form>
        </Form>
      </div>
    </div>
  )
}