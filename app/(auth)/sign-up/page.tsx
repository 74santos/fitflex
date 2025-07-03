// app/(auth)/sign-up/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import CredentialsSignUpForm from "./credentials-signup-form"; // 👈 Your signup form
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoLink from "@/components/shared/LogoLink";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/"); // ✅ Already signed in? Redirect to homepage
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <LogoLink />
          <CardTitle className="text-center text-2xl">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Create your account to start shopping
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <CredentialsSignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
