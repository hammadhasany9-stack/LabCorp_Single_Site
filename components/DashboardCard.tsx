import Link from "next/link"
import { LucideIcon, MoveRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DashboardCardProps {
  title: string
  icon: LucideIcon
  description?: string
  href?: string
}

export function DashboardCard({ title, icon: Icon, description, href }: DashboardCardProps) {
  const cardContent = (
    <Card className="group hover:blue-600 dark:hover:blue-400 hover:shadow-xl hover:-translate-y-2 shadow-md transition-all duration-300 cursor-pointer rounded-2xl h-full flex flex-col">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex flex-col items-start gap-4 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-xl group-hover:bg-blue-200 dark:group-hover:bg-blue-900 transition-colors duration-200 flex-shrink-0">
            <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-fit">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-6 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
        
        <div className="font-semibold">
          <Button 
            variant="ghost"
            className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 font-semibold px-0 py-4 text-sm rounded-xl transition-all duration-300 align-bottom"
            style={{ verticalAlign: 'bottom' }}
          >
            Open Module
            <MoveRight className=" h-5 w-5 group-hover:translate-x-4 transition-transform duration-300" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{cardContent}</Link>
  }

  return cardContent
}
