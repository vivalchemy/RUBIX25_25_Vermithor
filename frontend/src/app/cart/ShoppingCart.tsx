"use client"

import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"

interface CartItem {
    id: string
    name: string
    vendor: string
    price: number
    quantity: number
    rating: number
    timeToArrive: string
    image: string
}

export default function ShoppingCart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const getLocalStorage = (key: string): any => {
        if (typeof window !== "undefined") {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : null
        }
        return null
    }

    const setLocalStorage = (key: string, value: any): void => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(value))
        }
    }

    useEffect(() => {
        const items = getLocalStorage("cartItems")
        if (items) {
            setCartItems(items)
        }
    }, [])

    const removeFromCart = (id: string) => {
        const updatedCart = cartItems.filter((item) => item.id !== id)
        setCartItems(updatedCart)
        setLocalStorage("cartItems", updatedCart)
    }

    const updateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) return
        const updatedCart = cartItems.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        )
        setCartItems(updatedCart)
        setLocalStorage("cartItems", updatedCart)
    }

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const handleStripePayment = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post("http://localhost:8080/payments/charge", {
                amount: totalPrice * 100, // Amount in cents
                currency: "usd", // Currency
            })
    
            if (response.status === 200) {
                const { paymentUrl } = response.data
                window.location.href = paymentUrl // Redirect to Stripe Checkout
            } else {
                alert(response.data.error || "Failed to create payment intent.")
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Axios-specific error handling
                alert(error.response?.data?.error || "An error occurred while processing the payment.")
            } else {
                // Generic error handling
                console.error("Unexpected error:", error)
                alert("An unexpected error occurred.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
            </CardHeader>
            <CardContent>
                {cartItems.length === 0 ? (
                    <p className="text-center text-gray-500">Your cart is empty</p>
                ) : (
                    <ul className="space-y-4">
                        {cartItems.map((item) => (
                            <li key={item.id} className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center space-x-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                                    <div>
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-gray-500">Vendor: {item.vendor}</p>
                                        <p className="text-sm text-gray-500">Rating: {item.rating} ★</p>
                                        <p className="text-sm text-gray-500">Time to Arrive: {item.timeToArrive}</p>
                                        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                        -
                                    </Button>
                                    <span>{item.quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        +
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
            <CardFooter className="justify-between">
                <strong>Total:</strong>
                <span>${totalPrice.toFixed(2)}</span>
                <Button
                    variant="default"
                    onClick={handleStripePayment}
                    disabled={cartItems.length === 0 || isLoading}
                >
                    {isLoading ? "Processing..." : "Proceed to Payment"}
                </Button>
            </CardFooter>
        </Card>
    )
}
