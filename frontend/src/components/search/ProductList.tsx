import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export function ProductList({ products }: { products: any[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">All Products</h2>
      <div className="sm:flex sm:space-around sm:flex-wrap sm:gap-8 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={100}
                height={100}
                className="rounded-md"
              />
              <div>
                <p className="font-semibold">${product.price.toFixed(2)}</p>
                <p>{product.vendor}</p>
                <p>Rating: {product.rating}/5</p>
                <p>Arrives in: {product.timeToArrive}</p>
                <p>People required: {product.peopleRequired}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


