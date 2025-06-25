'use client'

import DashboardNav from '@/components/DashboardNav'
import BackButton from '@/components/BackButton'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNav />
      <div className="p-4 flex-1">
        <BackButton />
        {children}
      </div>
    </div>
  )
}
