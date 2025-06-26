'use client';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Optional if using shadcn/ui

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[url('/patterns/dots.svg')] bg-repeat bg-background flex items-center justify-center px-6">

      <div className="text-center max-w-md">
       <Image src="/images/flogo.png" alt={`${APP_NAME} logo`} width={100} height={100} className="my-2 m-auto" priority unoptimized  />
        <h1 className="text-7xl font-extrabold tracking-tight text-red-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Page not found</h2>
        <p className="text-muted-foreground mb-6">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="default" size="lg">
            Go Home
          </Button>
        </Link>
      </div>
    </main>
  );
}
