'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from "@/components/Sidebar"
import { DirectToPatientSidebar } from "@/components/DirectToPatientSidebar"
import { ImpersonationBanner } from "@/components/ImpersonationBanner"

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isDirectToPatient = pathname?.includes('/direct-to-patient') ?? false
  
  return (
    <div className="min-h-screen">
      {/* Sidebar with integrated navbar - conditional based on portal */}
      {isDirectToPatient ? <DirectToPatientSidebar /> : <Sidebar />}
      
      {/* Main Content Area - Add left margin on large screens to account for fixed sidebar */}
      <div className="lg:ml-80">
        {/* Impersonation Status Banner */}
        <ImpersonationBanner />
        
        {/* Page Content */}
        <main className="min-h-screen bg-gray-50 dark:bg-zinc-950">
          {children}
        </main>
      </div>
    </div>
  )
}
