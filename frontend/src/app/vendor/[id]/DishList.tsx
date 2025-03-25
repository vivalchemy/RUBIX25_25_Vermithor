import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Order } from "@/lib/types/Reset"

interface DishListProps {
  dishes: Order[]
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
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDishes.map((dish) => (
            <TableRow key={dish.orderId}>
              <TableCell>{dish.orderTime.toString()}</TableCell>
              <TableCell>{dish.status}</TableCell>
              <TableCell>{dish.totalPrice.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


