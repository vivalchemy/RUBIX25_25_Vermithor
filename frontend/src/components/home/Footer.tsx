import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-green-600 text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">Foodie</h3>
          <p>Optimizing Local Freshness, Minimizing Global Footprint</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/vendors">Our Vendors</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4">Connect With Us</h4>
          <p>Email: info@foodie.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Address: 123 Local St, Freshville, FC 12345</p>
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-8 border-t border-green-500 text-center">
        <p>&copy; 2023 Foodie. All rights reserved.</p>
      </div>
    </footer>
  )
}


