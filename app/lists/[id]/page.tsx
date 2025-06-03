"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { doc, collection, query, where, onSnapshot, addDoc, deleteDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { TodoList, Task, UserRole } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { PageHeader } from "@/components/shared/page-header"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { ErrorState } from "@/components/shared/error-state"

import { TaskStats } from "@/components/list-detail/task-stats"
import { TaskList } from "@/components/list-detail/task-list"
import { CreateTaskDialog } from "@/components/list-detail/dialogs/create-task-dialog"
import { EditTaskDialog } from "@/components/list-detail/dialogs/edit-task-dialog"
import { DeleteTaskDialog } from "@/components/list-detail/dialogs/delete-task-dialog"

export default function ListDetailPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [list, setList] = useState<TodoList | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [userRole, setUserRole] = useState<UserRole>("viewer")
  const [error, setError] = useState("")

  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)

  const [isDeleteTaskDialogOpen, setIsDeleteTaskDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
      return
    }

    if (!user) return

    const listDocRef = doc(db, "lists", params.id)
    const unsubscribeList = onSnapshot(
      listDocRef,
      (listDoc) => {
        if (listDoc.exists()) {
          const listData = {
            id: listDoc.id,
            ...listDoc.data(),
            createdAt: listDoc.data().createdAt?.toDate() || new Date(),
          } as TodoList
          setList(listData)

          if (listData.ownerId === user.uid) {
            setUserRole("owner")
          } else {
            const collaborator = listData.collaborators?.find((c) => c.email === user.email)
            setUserRole(collaborator?.role || "viewer")
          }
        } else {
          setTimeout(() => {
            if (!list) {
              setError("List not found")
            }
          }, 1000)
        }
      },
      (error) => {
        setError("Failed to load list")
      },
    )

    const tasksQuery = query(collection(db, "tasks"), where("listId", "==", params.id))
    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Task[]
      setTasks(tasksData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
    })

    return () => {
      unsubscribeList()
      unsubscribeTasks()
    }
  }, [user, loading, router, params.id])

  const canEdit = userRole === "owner" || userRole === "admin"

  const handleCreateTask = async (name: string, description: string) => {
    if (!user) return

    try {
      await addDoc(collection(db, "tasks"), {
        listId: params.id,
        name,
        description,
        completed: false,
        createdAt: new Date(),
        createdBy: user.uid,
      })
      setError("")
    } catch (error) {
      setError("Failed to create task")
    }
  }

  const handleEditTask = async (task: Task, name: string, description: string) => {
    try {
      await updateDoc(doc(db, "tasks", task.id), {
        name,
        description,
      })
      setEditingTask(null)
      setIsEditTaskOpen(false)
      setError("")
    } catch (error) {
      setError("Failed to update task")
    }
  }

  const handleToggleTask = async (task: Task) => {
    try {
      await updateDoc(doc(db, "tasks", task.id), {
        completed: !task.completed,
      })
    } catch (error) {
      setError("Failed to update task")
    }
  }

  const handleDeleteTask = async () => {
    if (!taskToDelete) return

    try {
      await deleteDoc(doc(db, "tasks", taskToDelete))
      setError("")
      setIsDeleteTaskDialogOpen(false)
      setTaskToDelete(null)
    } catch (error) {
      setError("Failed to delete task")
    }
  }

  const openEditTask = (task: Task) => {
    setEditingTask(task)
    setIsEditTaskOpen(true)
  }

  const confirmDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId)
    setIsDeleteTaskDialogOpen(true)
  }

  const handleBack = () => {
    router.push("/dashboard")
  }

  if (loading || !list) {
    return <LoadingSpinner />
  }

  if (error && error === "List not found") {
    return <ErrorState title={error} onBack={handleBack} backLabel="Back to Dashboard" />
  }

  const completedTasks = tasks.filter((task) => task.completed)
  const pendingTasks = tasks.filter((task) => !task.completed)

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader listName={list.name} userRole={userRole} onBack={handleBack}>
        {canEdit && <CreateTaskDialog onCreateTask={handleCreateTask} />}
      </PageHeader>

      <main className="container mx-auto px-4 py-8">
        {error && error !== "List not found" && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <TaskStats completedCount={completedTasks.length} pendingCount={pendingTasks.length} />

        <TaskList
          tasks={tasks}
          canEdit={canEdit}
          onToggleTask={handleToggleTask}
          onEditTask={openEditTask}
          onDeleteTask={confirmDeleteTask}
        />

        <EditTaskDialog
          task={editingTask}
          isOpen={isEditTaskOpen}
          onClose={() => setIsEditTaskOpen(false)}
          onEditTask={handleEditTask}
        />

        <DeleteTaskDialog
          isOpen={isDeleteTaskDialogOpen}
          onClose={() => setIsDeleteTaskDialogOpen(false)}
          onConfirm={handleDeleteTask}
        />
      </main>
    </div>
  )
}
