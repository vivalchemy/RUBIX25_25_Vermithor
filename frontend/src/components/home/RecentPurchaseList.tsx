import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Star } from "lucide-react"

export default function RecentPurchaseList() {
  const purchases = [
    {
      id: 1,
      name: "Organic Apples",
      vendor: "Green Farms",
      price: 5.99,
      rating: 4.5,
      timeToArrive: "30 mins",
      peopleRequired: 1,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      name: "Fresh Bread",
      vendor: "Local Bakery",
      price: 3.99,
      rating: 4.8,
      timeToArrive: "20 mins",
      peopleRequired: 1,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      name: "Vegetable Box",
      vendor: "Community Garden",
      price: 15.99,
      rating: 4.7,
      timeToArrive: "45 mins",
      peopleRequired: 2,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 4,
      name: "Free-range Eggs",
      vendor: "Happy Hens Farm",
      price: 4.99,
      rating: 4.6,
      timeToArrive: "35 mins",
      peopleRequired: 1,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 5,
      name: "Organic Milk",
      vendor: "Dairy Delight",
      price: 3.49,
      rating: 4.9,
      timeToArrive: "25 mins",
      peopleRequired: 1,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 6,
      name: "Artisan Cheese",
      vendor: "Cheese Crafters",
      price: 7.99,
      rating: 4.7,
      timeToArrive: "40 mins",
      peopleRequired: 1,
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Repeat Purchase</h2>
        <Carousel className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-5xl mx-auto">
          <CarouselContent>
            {purchases.map((purchase) => (
              <CarouselItem key={purchase.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={purchase.image || "/placeholder.svg"}
                        alt={purchase.name}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-12 scale-125"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{purchase.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{purchase.vendor}</p>
                      <p className="font-bold mb-2">${purchase.price}</p>
                      <div className="flex items-center mb-2">
                        <Star className="text-yellow-400 mr-1" />
                        <span>{purchase.rating}</span>
                      </div>
                      <p className="text-sm">Arrives in: {purchase.timeToArrive}</p>
                      <p className="text-sm">People required: {purchase.peopleRequired}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}


