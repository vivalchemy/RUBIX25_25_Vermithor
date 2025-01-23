"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Ensure this runs only on client-side
    const checkLoginStatus = () => {
      const role = localStorage.getItem("userRole");
      const customerId = localStorage.getItem("customerId");
      const vendorId = localStorage.getItem("vendorId");

      setIsLoggedIn(!!(role || customerId || vendorId));
    };

    // Check immediately on mount
    checkLoginStatus();

    // Optional: Listen for storage changes across tabs
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("customerId");
    localStorage.removeItem("vendorId");

    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white bg-opacity-0 backdrop-blur-sm shadow-md">
      <Link href="/" className="text-2xl font-bold text-green-600">
        Foodie
      </Link>
      <div className="flex gap-2">
        {!isLoggedIn ? (
          <>
            <Button onClick={() => router.push("/auth")}>Sign up</Button>
            <Button variant="outline" onClick={() => router.push("/auth")}>Login</Button>
          </>
        ) : (
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}