'use server';

import { signInFormSchema } from "../validators";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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
