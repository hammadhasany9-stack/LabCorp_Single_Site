'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { generateOrderId } from '@/lib/utils/formatters'
import { useState, useEffect } from 'react'

export default function OrderConfirmationPage() {
  const router = useRouter()
  const [orderId, setOrderId] = useState<string>('')
  
  useEffect(() => {
    // Generate order ID on client side to avoid hydration mismatch
    setOrderId(generateOrderId())
  }, [])
  
  return (
    <main className="container mx-auto px-4 py-20 max-w-2xl">
      <div className="bg-white dark:bg-card rounded-2xl p-12 shadow-lg text-center">
        {/* Success Icon */}
        <div className="mb-6 animate-in zoom-in duration-300">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4">
          Order Placed Successfully!
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          Your order has been submitted and is being processed.
        </p>
        
        {/* Order Reference */}
        <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-6 my-8">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Order Reference ID
          </p>
          <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
            {orderId || 'Loading...'}
          </p>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
          A confirmation email has been sent to your registered email address.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => router.push('/programs/single-site/place-order')}
            variant="outline"
            className="group"
          >
            Place Another Order
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            onClick={() => router.push('/programs/single-site')}
            className="group"
          >
            Back to Single Site
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        {/* Additional Info */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-3">
            What happens next?
          </h2>
          <div className="text-left space-y-3 max-w-md mx-auto">
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">1</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your order will be reviewed and validated
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">2</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Kits will be prepared for shipment
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">3</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You'll receive a tracking notification via email
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
