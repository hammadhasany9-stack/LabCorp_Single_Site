'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from "next/image"
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { signOut } from "next-auth/react"
import { 
  ClipboardPlus,
  History,
  Building2,
  Menu,
  Home,
  User,
  Settings,
  LogOut
} from 'lucide-react'
import logo from "@/assets/logo.png"
import logoWhite from "@/assets/labcorp_white.png"
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
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
import { cn } from '@/lib/utils'

interface NavItem {
  title: string
  subtitle: string
  href: string
  icon: typeof ClipboardPlus
}

interface NavSection {
  title: string
  items: NavItem[]
}


const navigationSections: NavSection[] = [
  {
    
    title: "Direct to Patient",
    items: [
      { title: "Place New Order", subtitle: "Create and submit new orders", href: "/programs/direct-to-patient/place-order", icon: ClipboardPlus },
      { title: "Order History", subtitle: "View past orders and status", href: "/programs/direct-to-patient/order-history", icon: History },
      { title: "Sites", subtitle: "Manage your locations", href: "/programs/direct-to-patient/sites", icon: Building2 }
    ]
  }
]

export function DirectToPatientSidebar() {
  const pathname = usePathname()
  const { theme, resolvedTheme } = useTheme()
  const currentTheme = theme === 'system' ? resolvedTheme : theme

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/signin" })
  }

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Navbar Content in Sidebar */}
      <div className='flex items-wrap justify-between border-b bg-white dark:bg-card p-4'>
      
        <div className="flex items-center gap-1">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-blue-50 dark:hover:bg-blue-900 flex-shrink-0"
              aria-label="Go to Dashboard"
            >
              <Home className="h-5 w-5 text-blue-700 dark:text-blue-400" />
            </Button>
          </Link>
         
         <Image
          src={currentTheme === 'dark' ? logoWhite : logo}
          alt="Labcorp Logo"
          width={100}
          height={100}
          className="flex-shrink-0"
        />
        </div>
        
        <div className="flex items-center gap-1 justify-end">
          <ThemeToggle />
        </div>
      
      </div>

      <div className="flex-1 px-4 mt-4 min-h-0">
        {navigationSections.map((section, idx) => (
          <div key={section.title} className="pb-2">
            <h2 className="mb-3 px-4 text-sm font-semibold tracking-tight text-gray-500 dark:text-gray-400 uppercase">
              {section.title}
            </h2>
            
            <div className="space-y-2">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                const Icon = item.icon
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start h-auto py-2.5 flex-col gap-1 items-start mb-3",
                        isActive && "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900"
                      )}
                    >
                      <div className="flex items-center w-full">
                        <Icon className="h-5 w-5 mr-3" />
                        <span className="font-semibold">{item.title}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-8 mt-0.5">
                        {item.subtitle}
                      </span>
                    </Button>
                  </Link>
                )
              })}
            </div>
            {idx < navigationSections.length - 1 && <Separator className="mt-3" />}
          </div>
        ))}
      </div>

      {/* User Profile Section at Bottom */}
      <div className="mt-auto border-t bg-white dark:bg-card p-3 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3 pb-3 border-b">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-sm bg-blue-600 dark:bg-blue-500 text-white font-semibold">
              LC
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 truncate">LabCorp User</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">user@labcorp.com</p>
          </div>
        </div>
        
        <div className="space-y-0.5">
          <Link href="/profile">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-sm font-semibold h-8",
                pathname === '/profile' && "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
              )}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 h-8"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col border-r bg-white dark:bg-card w-80 h-screen fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Sheet/Drawer) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="py-6">
            <SidebarContent mobile />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
