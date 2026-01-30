import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  required?: boolean
}

export function FormSection({ title, description, children, required = false }: FormSectionProps) {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          {title}
          {required && <span className="text-destructive ml-1">*</span>}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  )
}
