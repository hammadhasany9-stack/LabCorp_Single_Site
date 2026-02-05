'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProgramTab } from '@/lib/types/unified-dashboard'

interface ProgramTabsProps {
  activeProgram: ProgramTab
  onProgramChange: (program: ProgramTab) => void
}

export function ProgramTabs({ activeProgram, onProgramChange }: ProgramTabsProps) {
  return (
    <div className="mb-6">
      <Tabs value={activeProgram} onValueChange={(value) => onProgramChange(value as ProgramTab)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="single-site"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500"
          >
            Single Site
          </TabsTrigger>
          <TabsTrigger 
            value="direct-to-patient"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500"
          >
            Direct to Patient
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
