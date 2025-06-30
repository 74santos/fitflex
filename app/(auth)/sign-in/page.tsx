import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { APP_NAME } from "@/lib/constants"
import CredentialsSignInForm from "./credentials-signin-form"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {redirect} from "next/navigation"

export const metadata: Metadata = {
  title: 'Sign In',
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string };
}) {

  const callbackUrl = searchParams?.callbackUrl || "/";
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(callbackUrl);
  }



  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href='/' className='flex-center'>
          <Image src="/images/logo.png" alt={`${APP_NAME} logo`} width={150} height={150} unoptimized priority />
          </Link>
           <CardTitle className="text-center text-2xl">Sign In</CardTitle>
           <CardDescription className="text-center">
            Sign in to your account
           </CardDescription>
        </CardHeader>

         <CardContent className="space-y-4">
         <CredentialsSignInForm /> 
         </CardContent>
      </Card>
    </div>
  )
}