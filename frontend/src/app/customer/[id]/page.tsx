"use client"

import { useEffect, useState } from "react"
import { Details } from "@/components/customer/Details"
import { Offers } from "@/components/customer/Offers"
import { RecentOrders } from "@/components/customer/RecentOrders"
import { PurchaseHistory } from "@/components/customer/PurchaseHistory"
import type { CustomerType, OffersType, OrdersType, ProductsType } from "@/lib/types"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"

// Mock data (replace with actual data fetching in a real application)
const mockCustomer: CustomerType = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phoneNumber: "+1 234 567 8900",
  location: "New York, NY",
}

const mockOffers: OffersType = [
  { id: 1, title: "20% Off First Order", description: "New customers get 20% off", image: "/placeholder.svg" },
  { id: 2, title: "Free Delivery", description: "Free delivery on orders over $50", image: "/placeholder.svg" },
]

const mockOrders: OrdersType = [

  {
    id: "ord1",
    productIds: ["prod1", "prod2"],
    totalPrice: 45.99,
    status: "delivered",
    timeToArrive: "20 minutes",
    orderDate: "2023-06-01",
  },
  {
    id: "ord1",
    productIds: ["prod1", "prod2"],
    totalPrice: 45.99,
    status: "delivered",
    timeToArrive: "20 minutes",
    orderDate: "2023-06-01",
  },
  {
    id: "ord1",
    productIds: ["prod1", "prod2"],
    totalPrice: 45.99,
    status: "delivered",
    timeToArrive: "20 minutes",
    orderDate: "2023-06-01",
  },
  {
    id: "ord2",
    productIds: ["prod3"],
    totalPrice: 15.99,
    status: "processing",
    timeToArrive: "30 minutes",
    orderDate: "2023-06-05",
  },
]

const mockProducts: ProductsType = [
  {
    id: "prod1",
    name: "Margherita Pizza",
    description: "Classic cheese pizza",
    image: "/placeholder.svg",
    peopleRequired: 2,
    price: 12.99,
    rating: 4.5,
    serves: 2,
    timeToArrive: "20 minutes",
    vendor: "Pizza Palace",
  },
  {
    id: "prod2",
    name: "Chicken Alfredo",
    description: "Creamy pasta with grilled chicken",
    image: "/placeholder.svg",
    peopleRequired: 1,
    price: 14.99,
    rating: 4.2,
    serves: 1,
    timeToArrive: "25 minutes",
    vendor: "Pasta Paradise",
  },
  {
    id: "prod3",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing",
    image: "/placeholder.svg",
    peopleRequired: 1,
    price: 8.99,
    rating: 4.0,
    serves: 1,
    timeToArrive: "15 minutes",
    vendor: "Green Eats",
  },
]

export default function Customer() {
  const { id } = useParams<{ id: string }>();

  const [customer, setCustomer] = useState<CustomerType>(mockCustomer)
  const [orders, setOrders] = useState<OrdersType>(mockOrders)
  const [pendingOrders, setPendingOrders] = useState<OrdersType>([])
  const [products, setProducts] = useState<ProductsType>(mockProducts)

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("/data/customers.json")
      .then((response) => {
        setCustomer(response.data.customers.find(customer => customer.id === id));
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load offers");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  useEffect(() => {
    axios
      .get("/data/orders.json")
      .then((response) => {
        setOrders(response.data.orders);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load offers");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get("/data/products.json")
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load offers");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'processing')
    setPendingOrders(pendingOrders)
  }, [orders])

  const handleCustomerUpdate = (updatedCustomer: CustomerType) => {
    setCustomer(updatedCustomer)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-gray-600 font-medium">Loading amazing offers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="text-red-500 font-semibold text-lg">{error}</div>
          <p className="text-gray-600">Please try again later or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-24 grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1 lg:col-span-1">
        <Details customer={customer} onUpdate={handleCustomerUpdate} />
      </div>
      <div className="md:col-span-2 lg:col-span-2">
        <RecentOrders orders={pendingOrders} products={products} />
      </div>
      <div className="md:col-span-2 lg:col-span-3">
        <Offers />
      </div>
      <div className="md:col-span-2 lg:col-span-3">
        <PurchaseHistory orders={orders} products={products} />
      </div>
    </div>
  )
}


