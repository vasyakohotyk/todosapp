"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Users, Shield } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Todo App</h1>
          <p className="text-xl text-gray-600 mb-8">Organize your tasks and collaborate with your team</p>
          <div className="space-x-4">
            <Button size="lg" onClick={() => router.push("/auth/login")}>
              Sign In
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push("/auth/register")}>
              Sign Up
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CheckSquare className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Task Management</CardTitle>
              <CardDescription>Create, edit, and organize your tasks efficiently</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>Invite team members and work together on projects</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Role-based Access</CardTitle>
              <CardDescription>Control permissions with admin and viewer roles</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
