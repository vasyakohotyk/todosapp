export interface User {
  uid: string
  email: string
  name: string
}

export interface TodoList {
  id: string
  name: string
  ownerId: string
  createdAt: Date
  collaborators: Collaborator[]
}

export interface Collaborator {
  email: string
  role: "admin" | "viewer"
  userId?: string
}

export interface Task {
  id: string
  listId: string
  name: string
  description: string
  completed: boolean
  createdAt: Date
  createdBy: string
}

export type UserRole = "owner" | "admin" | "viewer"
