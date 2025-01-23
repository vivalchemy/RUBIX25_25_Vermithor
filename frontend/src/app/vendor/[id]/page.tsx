"use client"

import { Vendor } from "@/lib/types/Reset"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

function VendorPage() {
  const { id } = useParams()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get(`/api/vendors/${id}`)
      .then((response) => {
        setVendor(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        setError(error)
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

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
          <div className="text-red-500 font-semibold text-lg">{error.message}</div>
          <p className="text-gray-600">Please try again later or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="mt-24">Vendor Page</div>
  )
}

export default VendorPage
