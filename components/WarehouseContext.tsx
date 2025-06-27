"use client"
import { createContext, useState } from 'react'

export interface WarehouseContextValue {
  selectedWarehouseId: string | null
  setSelectedWarehouseId: (id: string | null) => void
}

export const WarehouseContext = createContext<WarehouseContextValue>({
  selectedWarehouseId: null,
  setSelectedWarehouseId: () => {},
})

export function WarehouseProvider({ children }: { children: React.ReactNode }) {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null)
  return (
    <WarehouseContext.Provider value={{ selectedWarehouseId, setSelectedWarehouseId }}>
      {children}
    </WarehouseContext.Provider>
  )
}
