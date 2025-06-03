"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface ErrorStateProps {
  title: string
  description?: string
  onBack?: () => void
  backLabel?: string
}

export function ErrorState({ title, description, onBack, backLabel = "Go Back" }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        {description && <p className="text-gray-600 mb-6">{description}</p>}
        {onBack && (
          <Button onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
