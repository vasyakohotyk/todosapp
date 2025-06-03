"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckSquare, Square } from "lucide-react"

interface TaskStatsProps {
  completedCount: number
  pendingCount: number
}

export function TaskStats({ completedCount, pendingCount }: TaskStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <CheckSquare className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-gray-600">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Square className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-gray-600">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
