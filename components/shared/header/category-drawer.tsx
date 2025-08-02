'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
  categories: { category: string; count: number }[];
}

export default function CategoryDrawer({ categories }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClick = (category: string) => {
    router.push(`/search?category=${encodeURIComponent(category)}`);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="text-muted-foreground">
          <MenuIcon />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="p-4">
        {/* Accessibility Title */}
        <VisuallyHidden>
          <DrawerTitle>Categories</DrawerTitle>
        </VisuallyHidden>

        <DrawerHeader>
          <DrawerTitle className="text-lg font-bold mb-4">Select a Category</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-1">
          {categories.map((x) => (
            <DrawerClose asChild key={x.category}>
              <Button
                onClick={() => handleClick(x.category)}
                className="w-full justify-start"
                variant="ghost"
              >
                {x.category} ({x.count})
              </Button>
            </DrawerClose>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
