import { Sidebar } from "@/components/Sidebar"
import { ImpersonationBanner } from "@/components/ImpersonationBanner"

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* Sidebar with integrated navbar */}
      <Sidebar />
      
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
