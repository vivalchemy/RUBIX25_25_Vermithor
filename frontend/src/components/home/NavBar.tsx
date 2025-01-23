import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white bg-opacity-0 backdrop-blur-sm shadow-md">
      <Link href="/" className="text-2xl font-bold text-green-600">
        Foodie
      </Link>
      <div className="flex gap-2">
        <Button>
          Sign up
        </Button>
        <Button variant="outline">Login</Button>
      </div>
    </nav>
  )
}


