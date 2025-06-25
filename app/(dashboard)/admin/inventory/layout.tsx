'use client'

import DashboardNav from '@/components/DashboardNav'

export default function AdminInventoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNav />
      <div className="p-4 flex-1">
        {children}
      </div>
    </div>
  )
}
