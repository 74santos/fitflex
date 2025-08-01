import ThemeSwitcher from '@/components/themeSwitcher'

import Link from "next/link";
import Menu from "@/components/shared/header/menu"
import MainNav from "@/app/admin/main-nav"
import AdminSearch from '@/components/admin/admin-search';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
 

  return (

  
    <div className="flex flex-col">
<div className="bg-secondary shadow-sm ">
      <div className="border-b container mx-auto">
        <div className="flex items-center h-16 px-2">
   
        <Link
          href="/"
          className="cursor-pointer"
        >
        <ThemeSwitcher />
        </Link>
        <MainNav className="mx-6" />
        <div className="ml-auto items-center flex space-x-4">
          <div>
            <AdminSearch />
          </div>
          <Menu cartQty={0}/>
        </div>
        </div>
      </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
        {children}
      </div>
    </div>
  
  );
}
