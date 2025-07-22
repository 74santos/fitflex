'use client'

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { UserIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger, 
  DropdownMenuLabel,
  DropdownMenuItem

 } from "@/components/ui/dropdown-menu";

export default function UserButton() {
  const { data: session, status } = useSession();
  

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" }); // You can customize the callback
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  if (status === "loading") return null;

  // If not signed in
  if (!session) {
    return (
      <Link href="/sign-in">
        <Button className="flex items-center gap-2">
          <UserIcon className="w-5 h-5" />
          Sign In
        </Button>
      </Link>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 ">
          <UserIcon className="w-5 h-5" />
          {firstInitial || "Account"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none">
             {session.user?.name}
            </div>
            <div className="text-sm text-muted-foreground leading-none">
           {session.user?.email}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuLabel>
            <Link href="/user/profile" className=" w-full">User Profile</Link>
          </DropdownMenuLabel>
          
          <DropdownMenuLabel>
            <Link href="/user/orders" className=" w-full">Order History</Link>
          </DropdownMenuLabel>

          {session?.user?.role === "admin" && (
            <DropdownMenuLabel>
              <Link href="/admin/overview" className=" w-full">Admin Dashboard</Link>
            </DropdownMenuLabel>
          )}

        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOutIcon className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}






// return session ? (
  


// {/* <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2">
//       <LogOutIcon className="w-5 h-5" />
//       {firstInitial}
//     </Button>
//   ) : (
//     <Link href="/sign-in">
//       <Button className="flex items-center gap-2">
//         <UserIcon className="w-5 h-5" />
//         Sign In
//       </Button>
//     </Link>
//   ); */})