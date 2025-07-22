'use client';


import { useEffect } from "react";
import { toast } from "sonner";
import { updateProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import {  useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUserProfile } from "@/lib/actions/user.actions";

export default function ProfileForm() {
  const { data: session, update, status } = useSession();
  
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  });

   // 🔄 Set default values after session loads
   useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session, form]);

 
  if (status === "loading") return <p>Loading profile...</p>;
  if (!session) return <p>You must be signed in to view your profile.</p>;

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
     const res = await updateUserProfile(values)

    if (!res.success) {
      toast.error(res.message);
      
    }
    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
      },
    }

    await update(newSession);
    toast.success(res.message);
   
  };

  return (
      <Form {...form}>
        <form  className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input 
                    disabled 
                    placeholder="Email" 
                    className="input-field" 
                    {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

           <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
            )}
           />

        <Button 
          type="submit" 
          size='lg' 
          className="button col-span-2 w-full"
          disabled={form.formState.isSubmitting}
          >
            { form.formState.isSubmitting ? "Submitting..." : "Update Profile"}</Button>
          </div>
        </form>
      </Form>
  );
}


