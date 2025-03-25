import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Order } from "@/lib/types/Reset"

interface PurchaseHistoryProps {
  orders: Order[]
}

export function PurchaseHistory({ orders }: PurchaseHistoryProps) {
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
              <tr key={order.orderId} className="border-t">
                <td className="py-2">{order.orderId}</td>
                <td className="py-2">{order.item?.name}</td>
                <td className="py-2">${order.totalPrice.toFixed(2)}</td>
                <td className="py-2">{new Date(order.orderTime).toLocaleDateString()}</td>
                <td className="py-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

