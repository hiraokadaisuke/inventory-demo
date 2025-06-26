'use client'

import Link from 'next/link'
import Logo from './Logo'
import WarehouseSelect from './WarehouseSelect'
import ColumnSettingsDialog from './ColumnSettingsDialog'
import { Button } from './ui/button'
import SettingsMenu from './ui/SettingsMenu'

export default function DashboardHeader() {
  return (
    <>
      <SettingsMenu />
      <header className="flex items-center gap-3 px-4 py-2 bg-white">
        <Logo />
        <WarehouseSelect />
        <Button asChild>
          <Link href="/admin/inventory/bulk-import">一括CSV登録</Link>
        </Button>
        <Button asChild>
          <Link href="/admin/inventory/new">個別登録</Link>
        </Button>
        <ColumnSettingsDialog />
      </header>
    </>
  )
}
