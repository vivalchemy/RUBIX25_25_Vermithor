"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Search,
  SlidersHorizontal,
  DollarSign,
  MapPin,
  Clock,
  Star
} from "lucide-react"

export function SearchBar({ initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?query=${encodeURIComponent(query)}`)
  }

  return (
    <div className="max-w-4xl mx-auto mt-24">
      <form onSubmit={handleSearch} className="relative flex items-center gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 h-12 text-lg"
          />
        </div>
        <ProductFiltersSheet />
      </form>
    </div>
  )
}

function FilterSection({
  label,
  value,
  onChange,
  min,
  max,
  step,
  icon: Icon,
  unit
}: {
  label: string
  value: number[]
  onChange: (value: number[]) => void
  min: number
  max: number
  step: number
  icon: React.ElementType
  unit: string
}) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 text-gray-700">
        <Icon className="h-4 w-4" />
        <Label className="font-medium">
          {label}: {value[0]} - {value[1]} {unit}
        </Label>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={onChange}
        className="mt-2"
      />
    </div>
  )
}

function ProductFiltersSheet() {
  const [price, setPrice] = useState([0, 100])
  const [distance, setDistance] = useState([0, 50])
  const [time, setTime] = useState([0, 60])
  const [rating, setRating] = useState([0, 5])
  const router = useRouter()

  const applyFilters = () => {
    router.push(
      `/search?price=${price.join(",")}&distance=${distance.join(",")}&time=${time.join(",")}&rating=${rating.join(",")}`
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="h-12 w-12 shrink-0">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle>Filter Products</SheetTitle>
          <SheetDescription>
            Adjust the filters below to refine your search results
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <FilterSection
            label="Price Range"
            value={price}
            onChange={setPrice}
            min={0}
            max={100}
            step={1}
            icon={DollarSign}
            unit="$"
          />

          <FilterSection
            label="Distance"
            value={distance}
            onChange={setDistance}
            min={0}
            max={50}
            step={1}
            icon={MapPin}
            unit="km"
          />

          <FilterSection
            label="Time to Arrive"
            value={time}
            onChange={setTime}
            min={0}
            max={60}
            step={5}
            icon={Clock}
            unit="mins"
          />

          <FilterSection
            label="Rating"
            value={rating}
            onChange={setRating}
            min={0}
            max={5}
            step={0.1}
            icon={Star}
            unit="stars"
          />

          <Button
            onClick={applyFilters}
            className="w-full"
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
