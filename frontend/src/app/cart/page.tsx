import ShoppingCart from "@/app/cart/ShoppingCart"
import NavBar from "@/components/home/NavBar"

export default function CartPage() {
    return (
        <>
            <NavBar />
            <div className="container mx-auto mt-15 py-8">
                <h2 className="text-4xl text-center font-extrabold text-gray-800 tracking-tight m-12">
                    Your Shopping Cart
                </h2>
                <ShoppingCart />
            </div>
        </>
    )
}

