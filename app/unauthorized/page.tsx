import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unauthorized Access",
}

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-[url('/patterns/dots.svg')] bg-repeat bg-background flex flex-col items-center justify-center px-6">
       <Image src="/images/flogo.png" alt={`${APP_NAME} logo`} width={100} height={100} className="my-2 m-auto" priority unoptimized  />
      <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
      <p className="text-muted-foreground mb-8">You do not have permission to access this page.</p>
     
        <Button asChild >
        <Link href="/">Go Home</Link>
        </Button>
      
    </div>
  );
}