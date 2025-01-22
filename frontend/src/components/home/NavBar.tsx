import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NavBar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
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


