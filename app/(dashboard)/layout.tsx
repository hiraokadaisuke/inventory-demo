'use client'

import DashboardHeader from '@/components/DashboardHeader'
import { WarehouseProvider } from '@/components/WarehouseContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WarehouseProvider>
      <div className="min-h-screen flex flex-col">
        <DashboardHeader />
        <div className="p-4 flex-1">
          {children}
        </div>
      </div>
    </WarehouseProvider>
  )
}
