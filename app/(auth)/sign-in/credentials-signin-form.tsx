// app/(auth)/sign-in/credentials-signin-form.tsx
'use client'

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function CredentialsSignInForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      redirect: false,
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl  //this will be used after successful login
    });

    setPending(false);

    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl); // redirect manually since redirect: false
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          name='email'
          required
          autoComplete='email'
        />
      </div>
      <div>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          type='password'
          name='password'
          required
          autoComplete='current-password'
        />
      </div>

      <div>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? 'Signing In…' : 'Sign In'}
        </Button>
      </div>

      {error && <div className="text-center text-destructive">{error}</div>}

      <div className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="link">Sign Up</Link>
      </div>
    </form>
  );
}
