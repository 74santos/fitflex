'use client'

import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateUser } from "@/lib/actions/user.actions"
import { USER_ROLES } from "@/lib/constants"
import { updateUserSchema } from "@/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import {   ControllerRenderProps, useForm } from "react-hook-form"
import { toast } from "sonner"

import * as z from "zod"

export default function UpdateUserForm({user}:{user: z.infer<typeof updateUserSchema>}) {


  const router = useRouter()
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  })

  if (!user) return null

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    try {
      // Attempt to update the user with the form values + user ID
      const res = await updateUser({
        ...values,
        id: user.id
      })


       // If the update failed, show an error toast
      if(!res.success) {
        return toast.error(res.message || "Update failed." )
      }

      toast.success(res.message)
      form.reset(values); // instead of form.reset()
      router.push('/admin/users')
    } catch (error) {
      toast.error((error as Error).message)
      console.error("Update user error:", error);
    }
  }

  return (

    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
      {/* Email */}
      <div>
      <FormField
          control={form.control}
          name='email'
          render={({ field }: { field: ControllerRenderProps<z.infer<typeof updateUserSchema>, 'email'>}) => (
            <FormItem className="w-full ">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter email" disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
      </div>
      {/* Name */}
      <div>
      <FormField
          control={form.control}
          name='name'
          render={({ field }: { field: ControllerRenderProps<z.infer<typeof updateUserSchema>, 'name'>}) => (
            <FormItem className="w-full ">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
      </div>
      {/* Role */}
      <div className="mt-2">
      <FormField
          control={form.control}
          name='role'
          render={({ field }: { field: ControllerRenderProps<z.infer<typeof updateUserSchema>, 'role'>}) => (
            <FormItem className="w-full ">
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value.toString()} >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue 
                      placeholder="Select a role"/>  
                  </SelectTrigger>
                </FormControl>
               <SelectContent >
                {USER_ROLES.map((role) => (
                  <SelectItem key={role} value={role} >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
               </SelectContent>

              </Select>
              
              <FormMessage />
            </FormItem>
          )}
          />
      </div>

         <div className="justify-between mt-4">
          <Button type='submit' className='w-full cursor-pointer' disabled={ form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Updating...' : 'Update User'}

          </Button></div>

      </form>
    </Form>
   
  )
}