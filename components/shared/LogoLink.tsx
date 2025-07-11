
'use client';

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { APP_NAME } from "@/lib/constants";

export default function LogoLink() {
  const { resolvedTheme } = useTheme();

  const logoSrc = resolvedTheme === "dark" ? "/images/fwhtlogo.png" : "/images/logo.png";

  return (
    <Link href="/" className="flex-center">
      <Image
        src={logoSrc}
        alt={`${APP_NAME} logo`}
        width={150}
        height={150}
        unoptimized
        priority
      />
    </Link>
  );
}
