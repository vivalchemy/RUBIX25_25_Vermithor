import { Card, CardContent } from "@/components/ui/card"
import { Clock, Star } from "lucide-react"

import { Button } from "../ui/button"
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types/Reset";
import Image from "next/image";

// TODO: Remove - 1 from product id
export function TopRecommendations({ products }: { products: Product[] }) {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Top Recommendations</h2>
      <div className="sm:flex sm:space-around sm:flex-wrap sm:gap-8 gap-4">

        {products.map((product) => (
          <Card
            key={product.itemId}
            className="overflow-hidden shadow-md rounded-xl transition-all duration-300 hover:shadow-xl group"
            onClick={() => router.push(`/product/${Number(product.itemId) - 1}`)}
          >
            <CardContent className="p-0">
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="relative w-full h-full">
                  <Image
                    src={product.imgLink || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

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
                      variant="default"
                      size="sm"
                      className="shrink-0 shadow-sm hover:shadow transition-shadow"
                    >
                      $ {product.price.toFixed(2)}
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

