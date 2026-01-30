import { Check, Circle, Package, Truck, Home, CheckCircle2 } from 'lucide-react'
import { TrackingStatus, TrackingStep } from '@/lib/types/order-detail'
import { cn } from '@/lib/utils'

interface StepConfig {
  status: TrackingStatus
  label: string
  subtext: string
  icon: React.ReactNode
}

interface TrackingStatusStepperProps {
  steps: TrackingStep[]
  currentStatus?: TrackingStatus
}

const stepConfigs: StepConfig[] = [
  {
    status: 'label_created',
    label: 'Label Created',
    subtext: 'The shipment is created',
    icon: <Package className="h-4 w-4" />
  },
  {
    status: 'in_transit',
    label: 'In Transit',
    subtext: 'The package is moving through the logistics network',
    icon: <Truck className="h-4 w-4" />
  },
  {
    status: 'out_for_delivery',
    label: 'Out for Delivery',
    subtext: 'En route to final destination',
    icon: <Home className="h-4 w-4" />
  },
  {
    status: 'delivered',
    label: 'Delivered',
    subtext: 'It has been successfully delivered',
    icon: <CheckCircle2 className="h-4 w-4" />
  }
]

const getStepState = (
  stepStatus: TrackingStatus,
  currentStatus?: TrackingStatus,
  hasTimestamp?: boolean
): 'complete' | 'in_progress' | 'disabled' => {
  if (!currentStatus) return 'disabled'
  
  const currentIndex = stepConfigs.findIndex(s => s.status === currentStatus)
  const stepIndex = stepConfigs.findIndex(s => s.status === stepStatus)
  
  if (currentIndex === -1 || stepIndex === -1) return 'disabled'
  
  // Only the current step shows as "in progress"
  if (stepIndex === currentIndex) return 'in_progress'
  
  // Steps before current are complete
  if (stepIndex < currentIndex) return 'complete'
  
  // Steps after current are disabled
  return 'disabled'
}

const formatTimestamp = (date?: Date): string => {
  if (!date) return ''
  
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }
  
  return date.toLocaleString('en-US', options)
}

export function TrackingStatusStepper({ steps, currentStatus }: TrackingStatusStepperProps) {
  return (
    <div className="space-y-0">
      {stepConfigs.map((config, index) => {
        const step = steps.find(s => s.status === config.status)
        const state = getStepState(config.status, currentStatus, !!step?.timestamp)
        const isLast = index === stepConfigs.length - 1
        
        return (
          <div key={config.status} className="relative">
            {/* Step Item */}
            <div className="flex items-start gap-4 pb-8">
              {/* Icon Container */}
              <div className="relative flex-shrink-0">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    state === 'complete' && "bg-green-100 border-green-500 dark:bg-green-950 dark:border-green-600",
                    state === 'in_progress' && "bg-blue-100 border-blue-500 dark:bg-blue-950 dark:border-blue-600 animate-pulse",
                    state === 'disabled' && "bg-gray-100 border-gray-300 dark:bg-zinc-900 dark:border-zinc-700"
                  )}
                >
                  {state === 'complete' ? (
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : state === 'in_progress' ? (
                    <div className="text-blue-600 dark:text-blue-400">
                      {config.icon}
                    </div>
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400 dark:text-zinc-600" />
                  )}
                </div>
                
                {/* Vertical Line */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-5 top-10 w-0.5 h-full transition-all",
                      state === 'complete' && "bg-green-500 dark:bg-green-600",
                      state === 'in_progress' && "bg-blue-500 dark:bg-blue-600",
                      state === 'disabled' && "bg-gray-300 dark:bg-zinc-700"
                    )}
                  />
                )}
              </div>
              
              {/* Step Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4
                      className={cn(
                        "text-sm font-semibold",
                        state === 'complete' && "text-gray-900 dark:text-gray-50",
                        state === 'in_progress' && "text-blue-600 dark:text-blue-400",
                        state === 'disabled' && "text-gray-400 dark:text-gray-600"
                      )}
                    >
                      {config.label}
                    </h4>
                    <p
                      className={cn(
                        "text-xs mt-0.5",
                        state === 'complete' && "text-gray-600 dark:text-gray-400",
                        state === 'in_progress' && "text-gray-700 dark:text-gray-300",
                        state === 'disabled' && "text-gray-400 dark:text-gray-600"
                      )}
                    >
                      {config.subtext}
                    </p>
                  </div>
                  
                  {/* Status Badge */}
                  {state !== 'disabled' && (
                    <div
                      className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap",
                        state === 'complete' && "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
                        state === 'in_progress' && "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                      )}
                    >
                      {state === 'complete' ? 'Complete' : 'In Process'}
                    </div>
                  )}
                </div>
                
                {/* Timestamp */}
                {step?.timestamp && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
                    {formatTimestamp(step.timestamp)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
