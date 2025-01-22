import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Offers() {
  const offers = [
    { id: 1, title: "Fresh Vegetables", description: "20% off on local farm produce" },
    { id: 2, title: "Organic Fruits", description: "Buy 2 Get 1 Free on weekends" },
    { id: 3, title: "Artisan Bread", description: "Free delivery on orders above $30" },
    { id: 4, title: "Local Honey", description: "15% discount on your first purchase" },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Offers you might like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id}>
              <CardHeader>
                <CardTitle>{offer.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{offer.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}


