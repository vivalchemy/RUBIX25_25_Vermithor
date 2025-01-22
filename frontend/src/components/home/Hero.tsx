import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function Hero() {
  return (
    <section className="bg-green-100 py-20 text-center">
      <h1 className="text-5xl font-bold mb-4">Foodie</h1>
      <p className="text-xl mb-8">Optimizing Local Freshness, Minimizing Global Footprint</p>
      <div className="flex justify-center items-center">
        <Input type="text" placeholder="Search for local food..." className="w-1/2 mr-2" />
        <Button>
          <Search className="mr-2" /> Search
        </Button>
      </div>
    </section>
  )
}


