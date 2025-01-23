import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

interface BestDishProps {
  dish: {
    name: string
    rating: number
    image: string
  }
}

export default function BestDish({ dish }: BestDishProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Best Dish</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <Image src={dish.image || "/placeholder.svg"} alt={dish.name} width={100} height={100} className="rounded-md" />
        <div>
          <h3 className="font-semibold">{dish.name}</h3>
          <div className="flex items-center mt-1">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span>{dish.rating.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

