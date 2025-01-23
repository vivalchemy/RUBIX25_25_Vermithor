import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OrdersType, ProductsType } from "@/lib/types"

interface PurchaseHistoryProps {
  orders: OrdersType
  products: ProductsType
}

export function PurchaseHistory({ orders, products }: PurchaseHistoryProps) {
  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product ? product.name : "Unknown Product"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase History</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-2">Order ID</th>
              <th className="pb-2">Products</th>
              <th className="pb-2">Total</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="py-2">{order.id}</td>
                <td className="py-2">{order.productIds.map((id) => getProductName(id)).join(", ")}</td>
                <td className="py-2">${order.totalPrice.toFixed(2)}</td>
                <td className="py-2">{order.orderDate}</td>
                <td className="py-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

