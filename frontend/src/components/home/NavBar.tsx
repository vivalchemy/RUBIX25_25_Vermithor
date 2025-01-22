import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white bg-opacity-90 backdrop-blur-sm shadow-md">
      <Link href="/" className="text-2xl font-bold text-green-600">
        Foodie
      </Link>
      <div>
        <Button variant="outline" className="mr-2">
          Sign up
        </Button>
        <Button>Login</Button>
      </div>
    </nav>
  )
}


