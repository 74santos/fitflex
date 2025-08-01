'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import React from "react"

const links = [
  {
    title: 'Overview',
    href: '/admin/overview'
  },
  {
    title: 'Products',
    href: '/admin/products'
  },
  {
    title: 'Orders',
    href: '/admin/orders'
  },
  {
    title: 'Users',
    href: '/admin/users'
  }
]

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) { 
  const pathname = usePathname()
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {links.map((item) => (
        <Link key={item.href} href={item.href} className={cn('text-md font-medium transition-colors hover:text-blue-500' , pathname.includes(item.href) ? '' : 'text-muted-foreground')}>
        {item.title}
        </Link>
      ))}
    </nav>
  )
}