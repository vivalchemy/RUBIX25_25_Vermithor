"use client"

import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
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

const stripePromise = loadStripe("pk_test_51PXp2oIxKA4SqfaM2SFwVQVZBJ9bmcWnh2HgtcYashdagjEWjDthFk8Gn8Oj7wfu0jBldTMBMiE3UnUEuKkPm3mH00uW5HX8qL") // Replace with your Stripe publishable key

const PaymentForm = ({ totalPrice, onSuccess }: { totalPrice: number; onSuccess: () => void }) => {
    const stripe = useStripe()
    const elements = useElements()
    const [isProcessing, setIsProcessing] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!stripe || !elements) return

        setIsProcessing(true)
        try {
            const cardElement = elements.getElement(CardElement)
            if (!cardElement) throw new Error("Card Element not found")

            // Create payment method
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
            })

            if (error) {
                alert(error.message)
                setIsProcessing(false)
                return
            }

            // Make a payment request
            const response = await axios.post("http://localhost:8080/payments/charge", {
                paymentMethodId: paymentMethod.id,
                amount: totalPrice * 100, // Amount in cents
                currency: "usd", // Currency
            })

            if (response.status === 200) {
                alert("Payment successful!")
                onSuccess()
            } else {
                alert(response.data.error || "Payment failed.")
            }
        } catch (error) {
            console.error("Payment error:", error)
            alert("An unexpected error occurred.")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <CardElement className="p-4 border rounded-md w-full" />
            <Button
                type="submit"
                variant="default"
                className="mt-4"
                disabled={isProcessing}
            >
                {isProcessing ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
            </Button>
        </form>
    )
}

export default function ShoppingCart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [showPaymentForm, setShowPaymentForm] = useState(false)

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

    const handlePaymentSuccess = () => {
        setCartItems([])
        setLocalStorage("cartItems", [])
        setShowPaymentForm(false)
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
                                    <img src={item.imgLink} alt={item.name} className="w-16 h-16 object-cover" />
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
            <CardFooter className="flex flex-col space-y-4">
                <div className="flex justify-between">
                    <strong>Total:</strong>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
                <Button
                    variant="default"
                    onClick={() => setShowPaymentForm(true)}
                    disabled={cartItems.length === 0}
                >
                    Proceed to Payment
                </Button>
            </CardFooter>

            {/* Payment Form Modal */}
            <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Payment Details</DialogTitle>
                    </DialogHeader>
                    <Elements stripe={stripePromise}>
                        <PaymentForm totalPrice={totalPrice} onSuccess={handlePaymentSuccess} />
                    </Elements>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
