import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface VendorHeaderProps {
  name: string
  rating: number
}

export default function VendorHeader({ name, rating }: VendorHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold">{name}</h1>
        <div className="flex items-center mt-2">
          <Star className="w-5 h-5 text-yellow-400 mr-1" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>
      <Button>Edit</Button>
    </div>
  )
}


