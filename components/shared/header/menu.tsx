import Link from "next/link";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function MenuSheet() {
  return (

    <div className="flex items-center space-x-4">
    <nav className="hidden md:flex w-full max-w-xs gap-4">
      <ModeToggle />

      <Link href="/cart" className="relative my-auto">
        <ShoppingCart className="w-6 h-6  hover:text-black" />
        <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
          3
        </span>
      </Link>

      <Button>
        <Link href="/login" className="flex items-center gap-2">
          <UserIcon className="w-6 h-6  hover:text-black" />
          Sign In
        </Link>
      </Button>
    </nav>
    <nav className="md:hidden p-8">
       <Sheet>
        <SheetTrigger className="align-middle">
          <EllipsisVertical />
       </SheetTrigger>
       <SheetContent className="flex flex-col items-start pt-6 pl-6 ">
        <SheetTitle>Menu</SheetTitle>
        <ModeToggle />
        <Button asChild variant='ghost'>
        <Link href="/cart" className="relative ">
        <ShoppingCart className="w-6 h-6  hover:text-black" /> Cart
        <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
          3
        </span>
      </Link>
        </Button>

        <Button>
        <Link href="/login" className="flex items-center gap-2">
          <UserIcon className="w-6 h-6  hover:text-black" />
          Sign In
        </Link>
      </Button>

        <SheetDescription> </SheetDescription>
       </SheetContent>

       </Sheet>
    </nav>
   
    </div>

  );
}
