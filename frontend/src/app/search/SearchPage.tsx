"use client"

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Dynamically import components to prevent SSR issues
const SearchBar = dynamic(() => import("@/components/search/SearchBar").then(mod => mod.SearchBar), { ssr: false });
const Map = dynamic(() => import("@/components/search/Map").then(mod => mod.Map), { ssr: false });
const TopRecommendations = dynamic(() => import("@/components/search/TopRecommendation").then(mod => mod.TopRecommendations), { ssr: false });
const ProductList = dynamic(() => import("@/components/search/ProductList").then(mod => mod.ProductList), { ssr: false });
const NavBar = dynamic(() => import("@/components/home/NavBar").then(mod => mod.default), { ssr: false });

import { Product } from "@/lib/types/Reset";

export default function Search() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use client-side path for axios get
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/data/products.json");
        setProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load recent products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="text-red-500 font-semibold text-lg">{error}</div>
          <p className="text-gray-600">Please try again later or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  // Safely handle query parameter
  const query = searchParams.get("query") ?? "";

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.vendor.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <SearchBar initialQuery={query} />
        <div className="mt-8 grid grid-cols-1 gap-8">
          <div className="mx-auto">
            <TopRecommendations products={filteredProducts.slice(0, 3)} />
          </div>
          <Map products={filteredProducts} />
          <div>
            <ProductList products={filteredProducts} itemsPerPage={14} />
          </div>
        </div>
      </div>
    </>
  );
}