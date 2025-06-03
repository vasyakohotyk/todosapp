"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import type { UserRole } from "@/lib/types"

interface PageHeaderProps {
  listName: string
  userRole: UserRole
  onBack: () => void
  children?: React.ReactNode
}

export function PageHeader({ listName, userRole, onBack, children }: PageHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{listName}</h1>
              <p className="text-gray-600">
                Your role: <Badge variant="secondary">{userRole}</Badge>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">{children}</div>
        </div>
      </div>
    </header>
  )
}
