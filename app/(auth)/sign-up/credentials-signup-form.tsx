'use client'


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState } from 'react'
import { signUpUser } from "@/lib/actions/user.actions";

export default function CredentialSignUpForm() {
  const [formState, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  return (
    <form action={action} className="space-y-6">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Sign Up
      </Button>

      {formState.message && (
        <div
          className={`text-center ${
            formState.success ? "text-green-600" : "text-destructive"
          }`}
        >
          {formState.message}
        </div>
      )}

      <div className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="link">
          Sign In
        </Link>
      </div>
    </form>
  );
}
