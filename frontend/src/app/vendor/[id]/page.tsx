"use client"
import { useEffect, useState } from "react"
import VendorHeader from "./VendorHeader"
import BestDish from "./BestDish"
import TotalEarnings from "./TotalEarnings"
import DishList from "./DishList"
import axios from "axios"
import { Loader2, Table } from "lucide-react"
import NavBar from "@/components/home/NavBar"
import Markdown from 'react-markdown'
import { Order } from "@/lib/types/Reset"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export interface VendorType {
  name: string
  rating: number
  totalEarnings: number
  bestDish: BestDishType
  dishes: DishType[]
}

export interface BestDishType {
  name: string
  rating: number
  image: string
}

export interface DishType {
  id: number
  name: string
  status: string
  rating: number
}


export interface AiResponse {
  predicted_sales: number
  last_7_days_items: Last7DaysItem[]
}

export interface Last7DaysItem {
  Item: string
  "Sales (Qty)": number
}

export default function VendorDashboard() {
  const [filter, setFilter] = useState<"all" | "listed" | "draft" | "archived">("all")
  const [vendor, setVendor] = useState<VendorType | null>(null)
  const [loading, setLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState<AiResponse | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("/data/vendor.json")
      .then((response) => {
        setVendor(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load offers");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      console.log(response.data);
      setOrders(response.data);
    }).catch((err) => {
      console.error(err);
      setError("Failed to load orders");
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .post("http://localhost:8000/predict-food", {
        last_7_days_data: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
      })
      .then((response) => {
        setAiResponse(response.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

      <div className="mt-24 container mx-auto px-4 space-y-6">
        <VendorHeader name={vendor?.name as string} rating={vendor?.rating as number} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BestDish dish={vendor?.bestDish as BestDishType} />
          <TotalEarnings amount={vendor?.totalEarnings as number} />
        </div>
        <div className="bg-gray-200 p-4 rounded-lg">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Sales Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p>Predicted Sales: ${aiResponse?.predicted_sales.toLocaleString()}</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Sales (Qty)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aiResponse?.last_7_days_items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.Item}</TableCell>
                      <TableCell className="text-right">{item["Sales (Qty)"].toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <DishList dishes={orders} filter={filter} setFilter={setFilter} />
      </div>
    </>
  )
}


