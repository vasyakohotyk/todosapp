"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
import type { TodoList } from "@/lib/types"

interface EditListDialogProps {
  list: TodoList | null
  isOpen: boolean
  onClose: () => void
  onEditList: (list: TodoList, name: string) => Promise<void>
}

export function EditListDialog({ list, isOpen, onClose, onEditList }: EditListDialogProps) {
  const [listName, setListName] = useState("")

  useEffect(() => {
    if (list) {
      setListName(list.name)
    }
  }, [list])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!list || !listName.trim()) return

    await onEditList(list, listName)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit List</DialogTitle>
          <DialogDescription>Update the name of your todo list.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editListName">List Name</Label>
              <Input id="editListName" value={listName} onChange={(e) => setListName(e.target.value)} required />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update List</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
