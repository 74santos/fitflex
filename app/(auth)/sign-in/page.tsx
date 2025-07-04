// app/(auth)/sign-in/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import CredentialsSignInForm from "./credentials-signin-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoLink from "@/components/shared/LogoLink";

export const metadata: Metadata = {
  title: "Sign In",
};

type SearchParams = Record<string, string | string[] | undefined>;

interface SignInPageProps {
  searchParams?: Promise<SearchParams>;
}
export default async function SignInPage({ searchParams }: SignInPageProps) {

  // Await the Promise here:
  const resolvedSearchParams = await searchParams;
  const rawCallbackUrl = resolvedSearchParams?.callbackUrl;
  const callbackUrl = typeof rawCallbackUrl === "string" ? rawCallbackUrl : "/";

  const session = await getServerSession(authOptions);
  if (session) {
    redirect(callbackUrl);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <LogoLink />
          <CardTitle className="text-center text-2xl">Sign In</CardTitle>
          <CardDescription className="text-center">Sign in to your account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
}
