'use server'

import { signInFormSchema } from "../validators"
import { signIn } from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"

// Sign in the user with credentials (NextAuth v4: redirect to signIn endpoint)
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password')
    });

    const result = await signIn("credentials", {
      redirect: false, // <== prevents redirect
      email: user.email,
      password: user.password
    });

    if (result?.error) {
      return {
        success: false,
        message: result.error
      };
    }

    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return {
      success: false,
      message: "Invalid email or password",
    };
  }
}

// Sign out user — NextAuth v4 requires doing this on the client
// This will just return a message — real signOut must happen client-side
export async function signOutUser() {
  return {
    success: false,
    message: "signOut() must be called from a client component in NextAuth v4.",
  };
}







// import { redirect } from "next/navigation"

// export async function signInWithCredentials(prevState: unknown, formData: FormData) {
//   try {
//     const user = signInFormSchema.parse({
//       email: formData.get('email'),
//       password: formData.get('password')
//     });

//     // 🔐 Redirect to built-in NextAuth credentials sign-in route
//     redirect(`/api/auth/callback/credentials?email=${encodeURIComponent(user.email)}&password=${encodeURIComponent(user.password)}`);
//   } catch (error) {
//     if (isRedirectError(error)) {
//       throw error;
//     }

//     return {
//       success: false,
//       message: "Invalid email or password",
//     };
//   }
// }














//NextAuth v5Beta

// import { signInFormSchema } from "../validators"
// import { signIn, signOut } from "@/auth"
// import { isRedirectError } from "next/dist/client/components/redirect-error"

// // Sign in the user with credentials
// export async function signInWithCredentials(prevState: unknown, formData: FormData) {
//   try {
//     const user = signInFormSchema.parse({
//       email: formData.get('email'),
//       password: formData.get('password')
//     })
//    await signIn('credentials', user)
//    return { success: true, message: 'Signed in successfully' }

//   } catch (error) {
//     if(isRedirectError(error)) {
//       throw error
//     }
//     return { success: false, message:"Invalid email or password" }
//   }
// }

// // Sign user out
// export async function signOutUser() {
//   await signOut();
// }