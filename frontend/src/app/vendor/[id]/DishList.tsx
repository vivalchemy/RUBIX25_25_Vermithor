import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface Dish {
  id: number
  name: string
  status: string
  rating: number
}

interface DishListProps {
  dishes: Dish[]
  filter: "all" | "listed" | "draft" | "archived"
  setFilter: (filter: "all" | "listed" | "draft" | "archived") => void
}

export default function DishList({ dishes, filter, setFilter }: DishListProps) {
  const filteredDishes = dishes.filter((dish) => filter === "all" || dish.status === filter)

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          All
        </Button>
        <Button variant={filter === "listed" ? "default" : "outline"} onClick={() => setFilter("listed")}>
          Listed
        </Button>
        <Button variant={filter === "draft" ? "default" : "outline"} onClick={() => setFilter("draft")}>
          Draft
        </Button>
        <Button variant={filter === "archived" ? "default" : "outline"} onClick={() => setFilter("archived")}>
          Archived
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDishes.map((dish) => (
            <TableRow key={dish.id}>
              <TableCell>{dish.name}</TableCell>
              <TableCell>{dish.status}</TableCell>
              <TableCell>
                {dish.rating > 0 ? (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{dish.rating.toFixed(1)}</span>
                  </div>
                ) : (
                  "N/A"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


