'use server';

import { shippingAddressSchema, signInFormSchema, signUpFormSchema, paymentMethodSchema } from "../validators";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../serverUtils";
import { ShippingAddress } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import z from "zod";



// Server Action — Sign in via redirect
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Redirect to NextAuth credentials sign-in route with query params
    redirect(`/api/auth/callback/credentials?email=${encodeURIComponent(user.email)}&password=${encodeURIComponent(user.password)}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return {
      success: false,
      message: "Invalid email or password",
    };
  }
}

// Placeholder for client-side signOut
export async function signOutUser() {
  return {
    success: false,
    message: "signOut() must be called from a client component in NextAuth v4.",
  };
}


// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    // Validate user input
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email already exists.",
      };
    }

    // Hash password and create user
    const hashedPassword = hashSync(user.password, 10);
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });

    redirect("/sign-in");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error("Sign-up error:", error);

    return {
      success: false,
      message: formatError(error) || "There was an error registering the user",
    };
  }
}


// Get user by the ID
export async function getUserById(userId: string) {
   const user = await prisma.user.findFirst({
     where: { id: userId },
   })
   if (!user) throw new Error("User not found")
   return user
  
}

// Update the user's address

export async function updateUserAddress( data: ShippingAddress) {
  try {
    const session = await getServerSession(authOptions);
    
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id }
    })

    if (!currentUser) throw new Error("User not found")
    const address = shippingAddressSchema.parse(data)

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });
    return {
      success: true,
      message: "User updated successfully",
    }

  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
    
  }
}

// Update user's  payment method

export async function updateUserPaymentMethod( data: z.infer<typeof paymentMethodSchema>) {
  try {
    const session = await getServerSession(authOptions); 
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id }
    })

    if (!currentUser) throw new Error("User not found")
    const paymentMethod = paymentMethodSchema.parse(data)

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    })

    return {
      success: true,
      message: "User updated successfully",
    }
    
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
   }
  }

  // Update the user profile

  export async function updateUserProfile( user: {name: string; email: string }) {
    try {
      const session = await getServerSession(authOptions); 
      const currentUser = await prisma.user.findFirst({
        where: { id: session?.user?.id }
      })

      if (!currentUser) throw new Error("User not found")
      await prisma.user.update({
        where: { id: currentUser.id },
        data: { name: user.name },
      })

      return {
        success: true,
        message: "Profile updated successfully",
      }
    } catch (error) {
      return { success: false, message: formatError(error) }
    }
  }