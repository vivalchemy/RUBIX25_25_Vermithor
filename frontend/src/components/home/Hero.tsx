import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative bg-green-100 py-32 text-center">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/placeholder.svg?height=400&width=800')" }}
      ></div>
      <div className="relative z-10 bg-white bg-opacity-80 p-8 rounded-lg max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-green-600">Foodie</h1>
        <p className="text-xl mb-8 text-gray-700">Optimizing Local Freshness, Minimizing Global Footprint</p>
        <div className="flex justify-center items-center">
          <Input type="text" placeholder="Search for local food..." className="w-2/3 mr-2" />
          <Button>
            <Search className="mr-2" /> Search
          </Button>
        </div>
      </div>
    </section>
  )
}


