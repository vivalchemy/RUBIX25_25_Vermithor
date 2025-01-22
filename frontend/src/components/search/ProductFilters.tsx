"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function ProductFilters() {
  const [price, setPrice] = useState([0, 100])
  const [distance, setDistance] = useState([0, 50])
  const [time, setTime] = useState([0, 60])
  const [rating, setRating] = useState([0, 5])
  const router = useRouter()

  const applyFilters = () => {
    router.push(
      `/search?price=${price.join(",")}&distance=${distance.join(",")}&time=${time.join(",")}&rating=${rating.join(",")}`,
    )
  }

  return (
    <div className="space-y-4 mt-4">
      <div>
        <Label>
          Price Range: ${price[0]} - ${price[1]}
        </Label>
        <Slider min={0} max={100} step={1} value={price} onValueChange={setPrice} />
      </div>
      <div>
        <Label>
          Distance: {distance[0]} - {distance[1]} km
        </Label>
        <Slider min={0} max={50} step={1} value={distance} onValueChange={setDistance} />
      </div>
      <div>
        <Label>
          Time to Arrive: {time[0]} - {time[1]} mins
        </Label>
        <Slider min={0} max={60} step={5} value={time} onValueChange={setTime} />
      </div>
      <div>
        <Label>
          Rating: {rating[0]} - {rating[1]} stars
        </Label>
        <Slider min={0} max={5} step={0.1} value={rating} onValueChange={setRating} />
      </div>
      <Button onClick={applyFilters}>Apply Filters</Button>
    </div>
  )
}

