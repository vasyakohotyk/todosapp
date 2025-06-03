"use client"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { CheckSquare } from "lucide-react"
import { TaskCard } from "./task-card"
import type { Task } from "@/lib/types"

interface TaskListProps {
  tasks: Task[]
  canEdit: boolean
  onToggleTask: (task: Task) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskList({ tasks, canEdit, onToggleTask, onEditTask, onDeleteTask }: TaskListProps) {
  const completedTasks = tasks.filter((task) => task.completed)
  const pendingTasks = tasks.filter((task) => !task.completed)

  if (tasks.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <CardTitle className="text-gray-600 mb-2">No tasks yet</CardTitle>
          <CardDescription>
            {canEdit ? "Create your first task to get started." : "No tasks have been added to this list yet."}
          </CardDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {pendingTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Tasks</h3>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                canEdit={canEdit}
                onToggle={onToggleTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Completed Tasks</h3>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                canEdit={canEdit}
                onToggle={onToggleTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
