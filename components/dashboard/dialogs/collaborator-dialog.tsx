"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TodoList, User } from "@/lib/types"

interface CollaboratorDialogProps {
  list: TodoList | null
  currentUser: User | null
  isOpen: boolean
  onClose: () => void
  onAddCollaborator: (email: string, role: "admin" | "viewer") => Promise<void>
  onUpdateCollaboratorRole: (oldCollaborator: any, newRole: "admin" | "viewer") => Promise<void>
  onRemoveCollaborator: (collaborator: any) => void
}

export function CollaboratorDialog({
  list,
  currentUser,
  isOpen,
  onClose,
  onAddCollaborator,
  onUpdateCollaboratorRole,
  onRemoveCollaborator,
}: CollaboratorDialogProps) {
  const [collaboratorEmail, setCollaboratorEmail] = useState("")
  const [collaboratorRole, setCollaboratorRole] = useState<"admin" | "viewer">("viewer")

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!collaboratorEmail.trim()) return

    await onAddCollaborator(collaboratorEmail, collaboratorRole)
    setCollaboratorEmail("")
    setCollaboratorRole("viewer")
  }

  if (!list || !currentUser) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Share Todo List</DialogTitle>
              <DialogDescription className="mt-1">Add users to the todo list and set their roles.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add collaborator form */}
          <form onSubmit={handleAddCollaborator} className="space-y-4">
            <div>
              <Label htmlFor="collaboratorEmail" className="text-sm font-medium">
                User Email
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="collaboratorEmail"
                  type="email"
                  value={collaboratorEmail}
                  onChange={(e) => setCollaboratorEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="flex-1"
                  required
                />
                <Button type="submit" className="bg-gray-500 hover:bg-gray-600 text-white px-6">
                  Add
                </Button>
              </div>
            </div>

            {/* Role selection */}
            <div>
              <Label className="text-sm font-medium">Role for new user</Label>
              <div className="flex gap-6 mt-3">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    id="admin-role"
                    name="collaboratorRole"
                    value="admin"
                    checked={collaboratorRole === "admin"}
                    onChange={(e) => setCollaboratorRole(e.target.value as "admin" | "viewer")}
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor="admin-role" className="font-medium text-sm cursor-pointer">
                      Admin
                    </label>
                    <p className="text-xs text-gray-600">Can edit tasks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    id="viewer-role"
                    name="collaboratorRole"
                    value="viewer"
                    checked={collaboratorRole === "viewer"}
                    onChange={(e) => setCollaboratorRole(e.target.value as "admin" | "viewer")}
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor="viewer-role" className="font-medium text-sm cursor-pointer">
                      Viewer
                    </label>
                    <p className="text-xs text-gray-600">View only</p>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Existing collaborators */}
          <div>
            <h3 className="font-medium text-sm mb-4">Users with access ({(list.collaborators?.length || 0) + 1})</h3>
            <div className="space-y-3">
              {/* Owner */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
                    {currentUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{currentUser.name}</p>
                    <p className="text-xs text-gray-600">{currentUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 bg-gray-200 px-3 py-1 rounded">Owner</span>
                </div>
              </div>

              {/* Collaborators */}
              {list.collaborators?.map((collaborator, index) => (
                <div
                  key={`${collaborator.email}-${collaborator.role}-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-400 text-white rounded-full flex items-center justify-center font-medium">
                      {collaborator.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{collaborator.email.split("@")[0]}</p>
                      <p className="text-xs text-gray-600">{collaborator.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={collaborator.role}
                      onChange={(e) => onUpdateCollaboratorRole(collaborator, e.target.value as "admin" | "viewer")}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveCollaborator(collaborator)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="bg-gray-900 hover:bg-gray-800 text-white px-8">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
