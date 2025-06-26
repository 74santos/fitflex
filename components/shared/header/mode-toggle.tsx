'use client';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem

} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

export default function ModeToggle() {

  const { theme, setTheme } = useTheme(); 

  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <span>
      <Button variant='ghost' className="focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer">
      {theme === 'system' ? (<SunMoon/>) : theme === 'dark' ? (<MoonIcon/>) : <SunIcon/>}</Button>
      </span>
    </DropdownMenuTrigger>


    <DropdownMenuContent>
      <DropdownMenuLabel>Theme</DropdownMenuLabel>
      <DropdownMenuSeparator />
     <DropdownMenuCheckboxItem checked={theme === 'system'} onCheckedChange={(checked) => checked && setTheme('system') }>
      System
      </DropdownMenuCheckboxItem>


      <DropdownMenuCheckboxItem checked={theme === 'dark'} onCheckedChange={(checked) => checked && setTheme('dark') }>
      Dark
      </DropdownMenuCheckboxItem>


      <DropdownMenuCheckboxItem checked={theme === 'light'} onCheckedChange={(checked) => checked && setTheme('light') }>
      Light
      </DropdownMenuCheckboxItem>

    </DropdownMenuContent>
  </DropdownMenu>
  )
}