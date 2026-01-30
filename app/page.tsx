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
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 max-w-[1400px]">
        <div className="mb-10">
          <h1 className="text-4xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2 mt-2">
            Welcome to LC Portal
          </h1>
          <p className="text-lg font-md text-gray-600 dark:text-gray-400 mb-12">
          Welcome, Hasany!
          </p>
        </div>

        {/* Program Ordering Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
            Programs
          </h2>
          <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
            Manage your programs and orders
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
            />
            
          </div>
        </section>

        {/* LC Ditek Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
            LC Ditek
          </h2>
          <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
            Manage your LC Ditek orders and reports
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            <DashboardCard
              title="Orders Report"
              icon={FileText}
              description="View and manage order reports"
            />
          </div>
        </section>

        {/* LC Orders Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
            LC Orders
          </h2>
          <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
            Manage your LC Orders and reports
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            <DashboardCard
              title="Dashboard"
              icon={LayoutDashboard}
              description="Orders dashboard and analytics"
            />
          </div>
        </section>
      </main>
    </div>
  )
}
