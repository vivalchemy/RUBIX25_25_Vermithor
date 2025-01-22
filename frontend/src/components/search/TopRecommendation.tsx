import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Star } from "lucide-react"
import Image from "next/image"
import { Button } from "../ui/button"

export function TopRecommendations({ products }: { products: any[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Top Recommendations</h2>
      <div className="sm:flex sm:space-around sm:flex-wrap sm:gap-8 gap-4">

        {products.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden shadow-md rounded-xl transition-all duration-300 hover:shadow-xl group"
          >
            <CardContent className="p-0">
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 flex items-center bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-sm">
                  <Star className="text-yellow-500 w-4 h-4" />
                  <span className="ml-1.5 text-sm font-medium">{product.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Primary Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-xl text-gray-800 leading-tight group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="shrink-0 shadow-sm hover:shadow transition-shadow"
                    >
                      Buy again
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{product.vendor}</p>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 mr-1.5 text-gray-500" />
                    <span className="text-sm">
                      Arrives in <span className="font-medium">{product.timeToArrive}</span>
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    <span>Serves </span>
                    <span className="font-medium">{product.peopleRequired}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

