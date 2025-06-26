'use client'

import DashboardHeader from '@/components/DashboardHeader'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <div className="p-4 flex-1">
        {children}
      </div>
    </div>
  )
}
