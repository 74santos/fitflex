"use client";

import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Logo() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid hydration mismatch by rendering nothing until mounted
    return null;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  const logoSrc =
    currentTheme === "dark"
      ? "/images/fwhtlogo.png"
      : "/images/logo.png";

  return (

    
    <Image
      src={logoSrc}
      alt={`${APP_NAME} logo`}
      width={135}
      height={135}
      priority
      className="mr-2"
      unoptimized
      style={{ display: "block" }}
    />
  );
}
