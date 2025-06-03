"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit2, Trash2, Users } from "lucide-react"
import type { TodoList, UserRole } from "@/lib/types"

interface ListCardProps {
  list: TodoList
  userRole: UserRole
  collaboratorCount: number
  taskStats: { completed: number; total: number }
  onEdit: (list: TodoList) => void
  onDelete: (listId: string) => void
  onManageCollaborators: (list: TodoList) => void
  onOpen: (listId: string) => void
}

export function ListCard({
  list,
  userRole,
  collaboratorCount,
  taskStats,
  onEdit,
  onDelete,
  onManageCollaborators,
  onOpen,
}: ListCardProps) {
  const canEdit = userRole === "owner" || userRole === "admin"
  const canDelete = userRole === "owner"

  const getRoleBadge = () => {
    switch (userRole) {
      case "owner":
        return "Owner"
      case "admin":
        return "Admin"
      case "viewer":
        return "Viewer"
      default:
        return "Viewer"
    }
  }

  const progressPercentage = taskStats.total ? Math.round((taskStats.completed / taskStats.total) * 100) : 0

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border border-gray-200">
      <CardContent className="p-6">
        {/* Header with title, role badge, and collaborator count */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">{list.name}</h3>
            <div className="flex items-center gap-1 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium">
              <span className="text-yellow-400">👑</span>
              {getRoleBadge()}
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Users className="h-4 w-4" />
            <span className="text-sm">{collaboratorCount}</span>
          </div>
        </div>

        {/* Task completion status */}
        <div className="mb-2">
          <p className="text-gray-600 text-sm">
            {taskStats.completed} of {taskStats.total} tasks completed
          </p>
        </div>

        {/* Progress section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-sm">Progress</span>
            <span className="text-gray-600 text-sm">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(list)
                }}
              >
                <Edit2 className="h-4 w-4 text-gray-600" />
              </Button>
            )}
            {canDelete && (
             <>
             <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(list.id)
                }}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation()
                onManageCollaborators(list)
              }}
            >
              <Users className="h-4 w-4 text-gray-600" />
            </Button>
              </>
            )}
          </div>
          <Button
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-medium"
            onClick={() => onOpen(list.id)}
          >
            Open
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
