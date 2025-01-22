import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    },
    {
      id: 2,
      name: "Fresh Bread",
      vendor: "Local Bakery",
      price: 3.99,
      rating: 4.8,
      timeToArrive: "20 mins",
      peopleRequired: 1,
    },
    {
      id: 3,
      name: "Vegetable Box",
      vendor: "Community Garden",
      price: 15.99,
      rating: 4.7,
      timeToArrive: "45 mins",
      peopleRequired: 2,
    },
    {
      id: 4,
      name: "Free-range Eggs",
      vendor: "Happy Hens Farm",
      price: 4.99,
      rating: 4.6,
      timeToArrive: "35 mins",
      peopleRequired: 1,
    },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Repeat Purchase</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {purchases.map((purchase) => (
            <Card key={purchase.id}>
              <CardHeader>
                <CardTitle>{purchase.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">{purchase.vendor}</p>
                <p className="font-bold mb-2">${purchase.price}</p>
                <div className="flex items-center mb-2">
                  <Star className="text-yellow-400 mr-1" />
                  <span>{purchase.rating}</span>
                </div>
                <p className="text-sm">Arrives in: {purchase.timeToArrive}</p>
                <p className="text-sm">People required: {purchase.peopleRequired}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}


