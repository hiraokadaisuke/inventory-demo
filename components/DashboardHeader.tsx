// components/DashboardHeader.tsx
import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import Logo from './Logo'
import SettingsMenu from './ui/SettingsMenu'

export default function DashboardHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white">
      <Logo />
      <SettingsMenu />
    </header>
  )
}
