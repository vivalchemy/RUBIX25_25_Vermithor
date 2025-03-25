import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "../ui/scroll-area"
import { Order } from "@/lib/types/Reset"

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "processing":
        return "bg-blue-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
      </CardHeader>
      <CardContent className="min-h-full max-h-72 overflow-y-auto">
        <ScrollArea className="h-full w-full leading-relaxed">
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.orderId} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Order #{order.orderId}</h3>
                  <p className="text-sm text-gray-600">{order.item?.name}</p>
                  <p className="text-sm text-gray-600">Total: ${order.totalPrice.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  <p className="text-sm text-gray-600 mt-1">{new Date(order.orderTime).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

