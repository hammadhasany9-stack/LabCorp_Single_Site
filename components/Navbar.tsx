"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from 'next-themes'
import { signOut } from "next-auth/react"
import logo from "@/assets/logo.png"
import logoWhite from "@/assets/labcorp_white.png"
import { User, Settings, LogOut, Home } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  title?: string
}

export function Navbar({ title = "Dashboard" }: NavbarProps) {
  const { theme, resolvedTheme } = useTheme()
  const currentTheme = theme === 'system' ? resolvedTheme : theme

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/signin" })
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-blur-md dark:bg-blur-md border-gray-200 dark:border-zinc-900">
      <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 backdrop-blur-md dark:backdrop-blur-md">
        <div className="flex h-16  items-center justify-between">
          <div className="flex items-center gap-4">
           
            <Image
              src={currentTheme === 'dark' ? logoWhite : logo}
              alt="Labcorp Logo"
              width={130}
              height={200}
              className="h-35 "
              />
            <div className="border-l border-gray-300 dark:border-zinc-600 pl-4">
              <h1 className="text-md font-md text-gray-600 dark:text-gray-400">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle/>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-blue-400 transition-all duration-150"
                  aria-label="User menu"
                >
                  <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-blue-600 dark:hover:ring-blue-400 transition-all duration-150">
                    <AvatarFallback className="text-md bg-blue-600 dark:bg-blue-500 text-white font-semibold">
                      LC
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="text-md">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem className="text-sm cursor-pointer font-semibold">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
            
                <DropdownMenuItem 
                  className="text-sm cursor-pointer text-red-600 dark:text-red-400 font-semibold"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
