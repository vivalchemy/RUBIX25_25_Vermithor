import ShoppingCart from "@/app/cart/ShoppingCart"
import NavBar from "@/components/home/NavBar"

export default function CartPage() {
    return (
        <>
            <NavBar />
            <div className="container mx-auto mt-24 py-8">
                <h1 className="text-2xl font-bold mb-4">Your Shopping Cart</h1>
                <ShoppingCart />
            </div>
        </>
    )
}

