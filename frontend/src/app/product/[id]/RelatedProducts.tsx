import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ProductType } from '@/lib/types'
import React from 'react'

function RelatedProducts({ products, handleAddToCart }: { products: ProductType[], handleAddToCart: (product: ProductType) => void }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Frequently Bought Together</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="flex items-center">
                <img
                  src={product.image || "/api/placeholder/200/200"}
                  alt={product.name}
                  className="w-24 h-24 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-base mb-1">{product.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-medium text-gray-900">${product.price}</span>
                    <Badge variant="secondary" className="text-xs">
                      {product.vendor}
                    </Badge>
                  </div>
                  <Button className="mt-2" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
