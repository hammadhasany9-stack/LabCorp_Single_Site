'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

interface ProgramBreakdownCardsProps {
  singleSiteCount: number
  directToPatientCount: number
  showTitle?: boolean
}

export function ProgramBreakdownCards({ 
  singleSiteCount, 
  directToPatientCount,
  showTitle = true
}: ProgramBreakdownCardsProps) {
  const cards = [
    {
      title: 'Single Site',
      count: singleSiteCount,
    },
    {
      title: 'Direct to Patient',
      count: directToPatientCount,
    },
  ]

  return (
    <div className="mb-6">
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          Program Breakdown
        </h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => {
          return (
            <Card key={card.title} className="border border-gray-200 dark:border-gray-800 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                      <Image
                        src="/icon.png"
                        alt={card.title}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-md text-gray-600 dark:text-gray-400 mb-1">
                        {card.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {card.count}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
