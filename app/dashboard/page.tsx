"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  or,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { TodoList } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ListCard } from "@/components/dashboard/list-card"
import { EmptyListsState } from "@/components/dashboard/empty-lists-state"
import { CreateListDialog } from "@/components/dashboard/dialogs/create-list-dialog"
import { EditListDialog } from "@/components/dashboard/dialogs/edit-list-dialog"
import { CollaboratorDialog } from "@/components/dashboard/dialogs/collaborator-dialog"
import { DeleteListDialog } from "@/components/dashboard/dialogs/delete-list-dialog"
import { DeleteCollaboratorDialog } from "@/components/dashboard/dialogs/delete-collaborator-dialog"

import { LoadingSpinner } from "@/components/shared/loading-spinner"

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const [lists, setLists] = useState<TodoList[]>([])
  const [error, setError] = useState("")
  const [listTasks, setListTasks] = useState<Record<string, { completed: number; total: number }>>({})
  const [loadingListId, setLoadingListId] = useState<string | null>(null)

  const [editingList, setEditingList] = useState<TodoList | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCollaboratorDialogOpen, setIsCollaboratorDialogOpen] = useState(false)
  const [selectedList, setSelectedList] = useState<TodoList | null>(null)

  const [isDeleteListDialogOpen, setIsDeleteListDialogOpen] = useState(false)
  const [listToDelete, setListToDelete] = useState<string | null>(null)
  const [isDeleteCollaboratorDialogOpen, setIsDeleteCollaboratorDialogOpen] = useState(false)
  const [collaboratorToDelete, setCollaboratorToDelete] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
      return
    }

    if (!user) return

    const q = query(
      collection(db, "lists"),
      or(
        where("ownerId", "==", user.uid),
        where("collaborators", "array-contains-any", [
          { email: user.email, role: "admin" },
          { email: user.email, role: "viewer" },
        ]),
      ),
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as TodoList[]
      setLists(listsData)

      if (selectedList) {
        const updatedSelectedList = listsData.find((list) => list.id === selectedList.id)
        if (updatedSelectedList) {
          setSelectedList(updatedSelectedList)
        }
      }
    })

    return unsubscribe
  }, [user, loading, router, selectedList])

  useEffect(() => {
    if (!user || lists.length === 0) return

    const unsubscribes: (() => void)[] = []

    lists.forEach((list) => {
      const tasksQuery = query(collection(db, "tasks"), where("listId", "==", list.id))

      const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
        const tasks = snapshot.docs.map((doc) => doc.data())
        const completed = tasks.filter((task) => task.completed).length
        const total = tasks.length

        setListTasks((prev) => ({
          ...prev,
          [list.id]: { completed, total },
        }))
      })

      unsubscribes.push(unsubscribe)
    })

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [user, lists])

  const handleCreateList = async (name: string) => {
    if (!user) return

    try {
      await addDoc(collection(db, "lists"), {
        name,
        ownerId: user.uid,
        createdAt: new Date(),
        collaborators: [],
      })
      setError("")
    } catch (error) {
      setError("Failed to create list")
    }
  }

  const handleEditList = async (list: TodoList, name: string) => {
    try {
      await updateDoc(doc(db, "lists", list.id), { name })
      setEditingList(null)
      setIsEditDialogOpen(false)
      setError("")
    } catch (error) {
      setError("Failed to update list")
    }
  }

  const handleDeleteList = async () => {
    if (!listToDelete) return

    try {
      await deleteDoc(doc(db, "lists", listToDelete))
      setError("")
      setIsDeleteListDialogOpen(false)
      setListToDelete(null)
    } catch (error) {
      setError("Failed to delete list")
    }
  }

  const handleAddCollaborator = async (email: string, role: "admin" | "viewer") => {
    if (!selectedList) return

    const newCollaborator = { email, role }

    try {
      await updateDoc(doc(db, "lists", selectedList.id), {
        collaborators: arrayUnion(newCollaborator),
      })
      setError("")
    } catch (error) {
      setError("Failed to add collaborator")
    }
  }

  const handleUpdateCollaboratorRole = async (oldCollaborator: any, newRole: "admin" | "viewer") => {
    if (!selectedList) return

    try {
      const updatedCollaborator = { ...oldCollaborator, role: newRole }
      await updateDoc(doc(db, "lists", selectedList.id), {
        collaborators: arrayRemove(oldCollaborator),
      })
      await updateDoc(doc(db, "lists", selectedList.id), {
        collaborators: arrayUnion(updatedCollaborator),
      })
      setError("")
    } catch (error) {
      setError("Failed to update collaborator role")
    }
  }

  const handleRemoveCollaborator = async () => {
    if (!selectedList || !collaboratorToDelete) return

    try {
      await updateDoc(doc(db, "lists", selectedList.id), {
        collaborators: arrayRemove(collaboratorToDelete),
      })
      setError("")
      setIsDeleteCollaboratorDialogOpen(false)
      setCollaboratorToDelete(null)
    } catch (error) {
      setError("Failed to remove collaborator")
    }
  }

  const getUserRole = (list: TodoList) => {
    if (!user) return "viewer"
    if (list.ownerId === user.uid) return "owner"
    const collaborator = list.collaborators?.find((c) => c.email === user.email)
    return collaborator?.role || "viewer"
  }

  const openEditDialog = (list: TodoList) => {
    setEditingList(list)
    setIsEditDialogOpen(true)
  }

  const confirmDeleteList = (listId: string) => {
    setListToDelete(listId)
    setIsDeleteListDialogOpen(true)
  }

  const openCollaboratorDialog = (list: TodoList) => {
    setSelectedList(list)
    setIsCollaboratorDialogOpen(true)
  }

  const confirmRemoveCollaborator = (collaborator: any) => {
    setCollaboratorToDelete(collaborator)
    setIsDeleteCollaboratorDialogOpen(true)
  }

  const handleOpenList = (listId: string) => {
    setLoadingListId(listId)

    setTimeout(() => {
      router.push(`/lists/${listId}`)
    }, 1000)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userName={user?.name || ""} onSignOut={signOut} />

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Lists</h2>
          <CreateListDialog onCreateList={handleCreateList} />
        </div>

        {lists.length === 0 ? (
          <EmptyListsState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => {
              const userRole = getUserRole(list)
              const collaboratorCount = (list.collaborators?.length || 0) + 1

              return (
                <ListCard
                  key={list.id}
                  list={list}
                  userRole={userRole}
                  collaboratorCount={collaboratorCount}
                  taskStats={listTasks[list.id] || { completed: 0, total: 0 }}
                  isLoading={loadingListId === list.id}
                  onEdit={openEditDialog}
                  onDelete={confirmDeleteList}
                  onManageCollaborators={openCollaboratorDialog}
                  onOpen={handleOpenList}
                />
              )
            })}
          </div>
        )}

        <EditListDialog
          list={editingList}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onEditList={handleEditList}
        />

        <CollaboratorDialog
          list={selectedList}
          currentUser={user}
          isOpen={isCollaboratorDialogOpen}
          onClose={() => setIsCollaboratorDialogOpen(false)}
          onAddCollaborator={handleAddCollaborator}
          onUpdateCollaboratorRole={handleUpdateCollaboratorRole}
          onRemoveCollaborator={confirmRemoveCollaborator}
        />

        <DeleteListDialog
          isOpen={isDeleteListDialogOpen}
          onClose={() => setIsDeleteListDialogOpen(false)}
          onConfirm={handleDeleteList}
        />

        <DeleteCollaboratorDialog
          isOpen={isDeleteCollaboratorDialogOpen}
          onClose={() => setIsDeleteCollaboratorDialogOpen(false)}
          onConfirm={handleRemoveCollaborator}
        />
      </main>
    </div>
  )
}
