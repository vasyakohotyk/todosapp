"use client"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { List } from "lucide-react"

export function EmptyListsState() {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <List className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <CardTitle className="text-gray-600 mb-2">No lists yet</CardTitle>
        <CardDescription>Create your first todo list to get started organizing your tasks.</CardDescription>
      </CardContent>
    </Card>
  )
}
