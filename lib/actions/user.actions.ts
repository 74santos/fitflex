'use server';

import { signInFormSchema, signUpFormSchema } from "../validators";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../serverUtils";



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
