"use client"

import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Vendor } from "@/lib/types/Reset"
import { Item } from "@/lib/types/Reset"
import axios from "axios"
import Image from "next/image"

export interface CartItem {
    orderId: number
    vendor: Vendor
    item: Item
    orderTime: string
    status: string
    totalPrice: number
    quantity: number
}

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY;
if (!stripeKey) {
    throw new Error("Stripe publishable key is missing from environment variables.");
}

const stripePromise = loadStripe(stripeKey);
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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/payments/charge`, {
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

    useEffect(() => {
        const fetchCartItems = async () => {
            const customerId = localStorage.getItem("customerId");
            if (!customerId) return;

            try {
                const response = await axios.get(`/api/orders/customer/${customerId}`);
                const pendingItems = response.data.filter((item: CartItem) => item.status === 'pending');
                setCartItems(pendingItems);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        }

        fetchCartItems();
    }, [])

    const updateQuantity = async (item: CartItem | undefined, newQuantity: number) => {
        if (!item?.orderId) return;

        if (newQuantity === 0) {
            try {
                await axios.delete(`/api/orders/${item.orderId}`);
                console.log("Item successfully removed from the cart");
                window.location.reload();
            } catch (error) {
                console.error("Error removing item from cart:", error);
            }
        } else {
            try {
                await axios.patch(`/api/orders/quantity/${item.orderId}?quantity=${newQuantity}&status=pending`);
                console.log("Order quantity successfully updated");
                window.location.reload();
            } catch (error) {
                console.error("Error updating order quantity:", error);
            }
        }
    }

    const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0)

    const handlePaymentSuccess = async () => {
        try {
            await Promise.all(
                cartItems.map((item) =>
                    axios.patch(`/api/orders/status/${item.orderId}?status=paid`)
                )
            );
            console.log("Order statuses updated successfully.");
        } catch (error) {
            console.error("Error updating order statuses:", error);
        }

        setCartItems([])
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
                            <li key={item.orderId} className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="relative w-16 h-16">
                                        <Image
                                            src={item.item.imgLink}
                                            alt={item.item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{item.item.name}</h3>
                                        <p className="text-sm text-gray-500">Vendor: {item.vendor.shopName}</p>
                                        <p className="text-sm text-gray-500">Rating: {item.item.rating} ★</p>
                                        <p className="text-sm text-gray-500">Time to Arrive: {item.item.timeToArrive} min</p>
                                        <p className="text-sm text-gray-500">${item.item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => updateQuantity(item, item.quantity - 1)}
                                    >
                                        -
                                    </Button>
                                    <span>{item.quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => updateQuantity(item, item.quantity + 1)}
                                    >
                                        +
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => updateQuantity(item, 0)}
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
