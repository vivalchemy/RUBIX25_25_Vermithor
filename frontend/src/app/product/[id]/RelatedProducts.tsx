import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Product } from '@/lib/types/Reset'
import React from 'react'
import Image from 'next/image'

function RelatedProducts({ products, handleAddToCart }: { products: Product[], handleAddToCart: (product: Product) => void }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Frequently Bought Together</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <Card key={product.name} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="flex items-center">
                <div className="relative w-24 h-24">
                  <Image
                    src={product.imgLink || ""}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

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
