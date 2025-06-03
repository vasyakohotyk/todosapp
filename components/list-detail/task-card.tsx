"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit2, Trash2 } from "lucide-react"
import type { Task } from "@/lib/types"

interface TaskCardProps {
  task: Task
  canEdit: boolean
  onToggle: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, canEdit, onToggle, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card className={task.completed ? "opacity-75" : ""}>
      <CardContent className="pt-4">
        <div className="flex items-start space-x-3">
          <Checkbox checked={task.completed} onCheckedChange={() => onToggle(task)} className="mt-1" />
          <div className="flex-1">
            <h4 className={`font-medium text-gray-900 ${task.completed ? "line-through" : ""}`}>{task.name}</h4>
            {task.description && (
              <p className={`text-gray-600 text-sm mt-1 ${task.completed ? "line-through" : ""}`}>{task.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">Created {task.createdAt.toLocaleDateString()}</p>
          </div>
          {canEdit && (
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
