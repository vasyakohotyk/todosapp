"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface DashboardHeaderProps {
  userName: string
  onSignOut: () => void
}

export function DashboardHeader({ userName, onSignOut }: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Todo Lists</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Welcome, {userName}</span>
          <Button variant="outline" onClick={onSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
