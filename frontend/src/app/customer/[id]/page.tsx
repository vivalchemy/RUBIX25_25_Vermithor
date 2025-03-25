"use client"

import { useEffect, useState } from "react"
import { Details } from "@/components/customer/Details"
import { Offers } from "@/components/customer/Offers"
import { RecentOrders } from "@/components/customer/RecentOrders"
import { PurchaseHistory } from "@/components/customer/PurchaseHistory"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import NavBar from "@/components/home/NavBar"
import type { Customer, Order } from "@/lib/types/Reset"

export default function Customer() {
  const { id } = useParams<{ id: string }>();

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    axios
      .get(`/api/customers/${id}`)
      .then((response) => {
        console.log(response.data)
        setCustomer(response.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load customer data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`/api/orders/customer/${id}`);
        console.log(response.data)
        setOrders(response.data);
      }
      catch (err) {
        console.error(err);
        setError("Failed to load orders");
      }
      finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [id]);

  const handleCustomerUpdate = (updatedCustomer: Customer) => {
    setCustomer(updatedCustomer);
  };

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
    <>
      <NavBar />
      <div className="container mx-auto mt-24 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 lg:col-span-1">
          {customer && <Details customer={customer} onUpdate={handleCustomerUpdate} />}
        </div>
        <div className="md:col-span-2 lg:col-span-2">
          <RecentOrders orders={orders} />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <Offers />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <PurchaseHistory orders={orders} />
        </div>
      </div>
    </>
  )
}