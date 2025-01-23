import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-500 to-green-700 text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {/* Brand Section */}
        <div>
          <h3 className="text-3xl font-bold mb-4">Foodie</h3>
          <p className="text-sm leading-relaxed">
            Optimizing Local Freshness, Minimizing Global Footprint.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:underline hover:text-green-200">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline hover:text-green-200">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/vendors" className="hover:underline hover:text-green-200">
                Our Vendors
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline hover:text-green-200">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Connect With Us</h4>
          <ul className="space-y-2">
            <li>
              <p className="hover:text-green-200">
                <strong>Email:</strong> info@foodie.com
              </p>
            </li>
            <li>
              <p className="hover:text-green-200">
                <strong>Phone:</strong> (123) 456-7890
              </p>
            </li>
            <li>
              <p className="hover:text-green-200">
                <strong>Address:</strong> 123 Local St, Freshville, FC 12345
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto mt-8 pt-8 border-t border-green-600 text-center text-sm">
        <p className="text-gray-200">&copy; 2023 Foodie. All rights reserved.</p>
      </div>
    </footer>
  );
}

