import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

export default function Offers() {
  const offers = [
    { id: 1, title: 'Fresh Vegetables', description: '20% off on local farm produce', image: '/placeholder.svg?height=200&width=200' },
    { id: 2, title: 'Organic Fruits', description: 'Buy 2 Get 1 Free on weekends', image: '/placeholder.svg?height=200&width=200' },
    { id: 3, title: 'Artisan Bread', description: 'Free delivery on orders above $30', image: '/placeholder.svg?height=200&width=200' },
    { id: 4, title: 'Local Honey', description: '15% discount on your first purchase', image: '/placeholder.svg?height=200&width=200' },
    { id: 5, title: 'Farm Fresh Eggs', description: '10% off on your first dozen', image: '/placeholder.svg?height=200&width=200' },
    { id: 6, title: 'Organic Milk', description: 'Buy 1 Get 1 Free this week', image: '/placeholder.svg?height=200&width=200' },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Offers you might like</h2>
        <Carousel className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-5xl mx-auto">
          <CarouselContent>
            {offers.map((offer) => (
              <CarouselItem key={offer.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={offer.image || "/placeholder.svg"}
                        alt={offer.title}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-12 scale-125"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{offer.title}</h3>
                      <p className="text-sm text-gray-600">{offer.description}</p>
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

