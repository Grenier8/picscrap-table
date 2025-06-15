"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="w-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 shadow-md py-4 px-8">
      <nav className="flex justify-between items-center">
        {/* <Link
          href="/"
          className="text-xl font-bold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Picscrap
        </Link> */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/">Inicio</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/products">Productos</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/scraping">Scraping</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {session && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="/logo-square.png" />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </nav>

      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>API Response</DialogTitle>
            <DialogDescription>{responseResult}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <pre className="text-sm overflow-auto">{responseResult}</pre>
          </div>
        </DialogContent>
      </Dialog> */}
    </header>
  );
}
