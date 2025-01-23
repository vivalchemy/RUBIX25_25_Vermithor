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

  const handleDashboard = () => {
    let role = localStorage.getItem("userRole");
    let customerId = localStorage.getItem("customerId");
    let vendorId = localStorage.getItem("vendorId");

    if (role === "customer" && customerId) {
      // Redirect to customer dashboard with customerId
      router.push(`/customer/${customerId}`);
    } else if (role === "vendor" && vendorId) {
      // Redirect to vendor dashboard with vendorId
      router.push(`/vendor/${vendorId}`);
    } else {
      // Handle cases where role or ID is missing
      console.error("Invalid role or ID not found in localStorage.");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] flex justify-between items-center p-4 bg-white bg-opacity-0 backdrop-blur-sm shadow-md">
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
          <>
            <Button variant="outline" onClick={handleDashboard}>
              Dashboard
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
