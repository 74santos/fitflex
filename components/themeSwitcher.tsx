'use client'


import { APP_NAME } from "@/lib/constants";
import Image from 'next/image'
import { useTheme } from 'next-themes'

export default function Logo() {
  const { theme, systemTheme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme
  const logoSrc =
    currentTheme === 'dark'
      ? '/images/fwhtlogo.png'
      : '/images/logo.png'

  return (
    <Image
      src={logoSrc}
      alt={`${APP_NAME} logo`}
      width={135}
      height={135}
      priority
      className="mr-2"
      unoptimized
      style={{ display: "block" }} // avoid inline invisibility
    />
  )
}
