"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/Navbar"
import { DashboardCard } from "@/components/DashboardCard"
import { 
  ClipboardList, 
  Users, 
  Building2, 
  FileText, 
  Home, 
  LayoutDashboard
} from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [currentTime, setCurrentTime] = useState("")

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/New_York',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }
      const formattedTime = now.toLocaleString('en-US', options)
      setCurrentTime(formattedTime)
    }

    // Update immediately
    updateTime()

    // Update every second
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  // Get user's first name or full name
  const getUserName = () => {
    if (!session?.user?.name) return "User"
    // Extract first name if available
    const firstName = session.user.name.split(' ')[0]
    return firstName
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 max-w-[1400px]">
        <div className="mb-10">
          <h1 className="text-4xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-5 mt-2">
            Welcome to LC Portal
          </h1>
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-1">
            Welcome, {getUserName()}!
          </p>
          <p className="text-md font-medium text-gray-500 dark:text-gray-500 mb-12">
            {currentTime} (Eastern Time)
          </p>
        </div>

         {/* LC Orders Section */}
         <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
            LC Order's Dashboard
          </h2>
          <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
            Check your orders and reports.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            <DashboardCard
              title="Dashboard"
              icon={LayoutDashboard}
              description="Orders dashboard and analytics"
              href="/lc-orders/dashboard"
            />
          </div>
        </section>

        {/* Program Ordering Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
            Programs
          </h2>
          <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
            Place, review and manage your orders.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            <DashboardCard
              title="Single Site"
              icon={ClipboardList}
              description="Manage single site ordering"
              href="/programs/single-site"
            />
            <DashboardCard
              title="Direct to Patient"
              icon={Users}
              description="Direct patient ordering system"
              href="/programs/direct-to-patient"
            />
            
          </div>
        </section>

        {/* LC Ditek Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
            LC Reports
          </h2>
          <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
            Manage your LC reports and generate assets to be used in your orders.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            <DashboardCard
              title="Orders Report"
              icon={FileText}
              description="View and manage order reports"
              href="/lc-report/order-report"
            />
          </div>
        </section>

       
      </main>
    </div>
  )
}
