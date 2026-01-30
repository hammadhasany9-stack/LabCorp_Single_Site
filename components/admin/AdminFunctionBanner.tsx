import { ShieldAlert } from 'lucide-react'

export function AdminFunctionBanner() {
  return (
    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-md p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <ShieldAlert className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Admin Function
          </h2>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            As an administrator, you can impersonate customer users to provide support and troubleshoot issues. 
            All impersonated actions are logged for security and audit purposes.
          </p>
        </div>
      </div>
    </div>
  )
}
