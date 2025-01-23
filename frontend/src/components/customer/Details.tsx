"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CustomerType } from "@/lib/types"
import { Pen } from "lucide-react"

interface CustomerDetailsProps {
  customer: CustomerType
  onUpdate: (customer: CustomerType) => void
}

export function Details({ customer, onUpdate }: CustomerDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedCustomer, setEditedCustomer] = useState(customer)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    onUpdate(editedCustomer)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedCustomer(customer)
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedCustomer({ ...editedCustomer, [e.target.name]: e.target.value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Customer Details
          {!isEditing && (
            <Button onClick={handleEdit} variant="outline" size="default">
              <Pen fill="currentColor" /> Edit
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={editedCustomer.name} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={editedCustomer.email} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" name="phoneNumber" value={editedCustomer.phoneNumber} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={editedCustomer.location} onChange={handleChange} />
            </div>
            <div className="flex justify-end space-x-2">
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {customer.name}
            </p>
            <p>
              <strong>Email:</strong> {customer.email}
            </p>
            <p>
              <strong>Phone:</strong> {customer.phoneNumber}
            </p>
            <p>
              <strong>Location:</strong> {customer.location}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

